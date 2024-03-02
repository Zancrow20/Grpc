using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Grpc.Core;
using JwtService.Protos;
using Microsoft.IdentityModel.Tokens;

namespace JwtService.Services;

public class Jwt : OpenService.OpenServiceBase
{
    private readonly IConfiguration _config;
    private static List<User> Users = new()
    {
        new User(){ Username="Ildar",Password="Islamov"},
        new User(){Username = "Artur",Password = "Yakupov"}
    };

    public Jwt(IConfiguration config)
    {
        _config = config;
    }

    public override Task<Reply> GetToken(User request, ServerCallContext context)
    {
        var res = Authenticate(request);
        if (res)
        {
            return Task.FromResult(new Reply() {Token = GenerateToken(request)}); 
        }
             
        return base.GetToken(request, context);
    }
    
    private string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier,user.Username),
        };
        var token = new JwtSecurityToken(_config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: credentials);


        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    //To authenticate user
    private bool Authenticate(User userLogin)
    {
        var currentUser = Users.FirstOrDefault(x =>
            string.Equals(x.Username, userLogin.Username, StringComparison.CurrentCultureIgnoreCase) &&
            x.Password == userLogin.Password);
        return currentUser != null;
    }
}