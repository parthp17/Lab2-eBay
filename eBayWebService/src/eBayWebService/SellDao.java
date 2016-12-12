package eBayWebService;

import java.sql.*;

import utilities.mysql;

public class SellDao {

	public boolean sellReview(String name, String desc, int quantity, int isBidding, String username, int price)
	{
		mysql sql = new mysql();
		boolean returnVal = false;
		try {
			
			String query = "Insert into items (itemName,description,quantity,isBidding,owner,price) values "
					+ "('"+name+"','"+desc+"','"+quantity+"','"+isBidding+"','"+username+"','"+price+"')";
			
			if(sql.storeData(query) > 0)
			{
				returnVal = true;
				
			}
			else
			{
				//
			}
			
			return returnVal;
		}
		catch(Exception e)
		{
			
			e.printStackTrace();
			return returnVal;
		}
	}
	
}
