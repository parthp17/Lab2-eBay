package eBayWebService;

import java.sql.*;
import eBayPOJO.Users;
import eBayPOJO.UsersInfo;
import utilities.mysql;
import java.util.Date;
import javax.jws.WebService;

@WebService
public class usersDao {

	public Users logIn(String username, String password, String date) {
		mysql sql = new mysql();
		try {

			String query = "select * from users where username='" + username + "' and password='" + password + "'";
			System.out.println(query);
			System.out.println("***********************************************************");
			ResultSet rs = sql.fetchData(query);

			if (!rs.first()) {
				System.out.println("hello");
				return null;
			} else {
				System.out.println("hello11");
				System.out.println("hello22");
				System.out.println(rs);
				
				Users usersObj = new Users();
				usersObj.setUsername(rs.getString("username"));
				usersObj.setFirstname(rs.getString("firstname"));
				usersObj.setLastname(rs.getString("lastname"));
				usersObj.setLastname(rs.getString("email"));
				usersObj.setLastLoggedIn(rs.getDate("lastLoggedIn"));
				System.out.println("hello3");
				
				String query1 = "update users set lastLoggedIn = '" + date +"'where username='"+username + "'" ;
				if(sql.storeData(query1) > 0)
				{
					System.out.println("Success");
					return usersObj;
				}
				else
				{
					System.out.println("failure");
					return usersObj;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public boolean signUp(String username, String password, String firstname, String lastname, String date, String email)
	{
		boolean returnval = false;
		mysql sql = new mysql();
		try{
		
			String query = "select * from users where username='"+email + "'" ;
			System.out.println(query);
			ResultSet rs = sql.fetchData(query);
			if(rs.first())
			{
				return returnval;
			}
			else
			{
				String query1 = "Insert into users (username,password,firstname,lastname,email,lastloggedIn) values ('" + email +"','"+password+"','"+firstname+"','"+lastname+ "','"+email+"','"+ date+"')";
				if(sql.storeData(query1) > 0)
				{
					System.out.println("Success");
					returnval = true;
					return returnval;
				}
				else
				{
					System.out.println("failure");
					return returnval;
				}
			}
			
		}catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean updateInfo(String username, String birthday, String contact, String adrLine1, String adrLine2, String city, String state, String zipcode)
	{
		boolean returnVal = false;
		mysql sql = new mysql();
		try{
		
			String query = "select * from userinfo where username='"+username + "'" ;
			System.out.println(query);
			ResultSet rs = sql.fetchData(query);
			String query1 ;
			if(rs.first())
			{
				query1 = "update userinfo set birthday='"+birthday+"',contact='"+contact+"',line1='"+adrLine1+"',line2='"+adrLine2+"',city='"+city+"',state='"+state+"',zipcode='"+zipcode+"' where username='"+username+"'";
				
			}
			else
			{
				query1 = "Insert into userinfo (username,birthday,contact,line1,line2,city,state,zipcode) values ('" +username+"','"+ birthday +"','"+contact+"','"+adrLine1+"','"+adrLine2+"','"+city+"','"+state+"','"+zipcode+"')";
				
			}
			
			if(sql.storeData(query1) > 0)
			{
				System.out.println("Success");
				returnVal = true;
				return returnVal;
			}
			else
			{
				System.out.println("failure");
				return returnVal;
			}
		}
		catch(Exception e){
			e.printStackTrace();
			return returnVal;
		}
		
	}
	
	public UsersInfo getProfile(String username)
	{
		mysql sql = new mysql();
		try
		{
			String query = "select * from userinfo where username='"+username + "'" ;
			System.out.println(query);
			ResultSet rs = sql.fetchData(query);
			if(rs.first())
			{
				UsersInfo objUsersInfo= new UsersInfo();
				objUsersInfo.setAdrLine1(rs.getString("adrLine1"));
				objUsersInfo.setAdrLine2(rs.getString("adrLine2"));
				objUsersInfo.setCity(rs.getString("city"));
				objUsersInfo.setState(rs.getString("state"));
				objUsersInfo.setBirthday(rs.getDate("birthday"));
				objUsersInfo.setContact(rs.getString("contact"));
				objUsersInfo.setZipcode(rs.getString("zipcode"));
				return objUsersInfo;
			}
			else 
			{
				return null;
			}
		}
		catch(Exception e)
		{
			return null;
		}
	}
}