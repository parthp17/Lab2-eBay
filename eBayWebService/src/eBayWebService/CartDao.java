package eBayWebService;

import java.sql.ResultSet;

import utilities.mysql;

class MyCart {
	int itemId;
	int price;
	String itemName;
	String description;
	String seller;
	int orderedquantity;
	int availquantity;
}

public class CartDao {

	public boolean addToCart(String username,int orderedquantity, int itemId) {
		mysql sql = new mysql();
		boolean returnVal = false;
		try {

			String query = "select * from cart where itemId = '" + itemId + "' and username = '" + username + "'";
			
			ResultSet rs = sql.fetchData(query);
			String query1;
			if (rs.first()) {
				query1 = "update cart set orderedquantity = " + orderedquantity + " where itemId = '" + itemId
						+ "' and username ='" + username + "'";
				if (sql.storeData(query1) > 0) {
					returnVal = true;
				}
			} else {
				query1 = "Insert into cart (username,itemId,orderedquantity) values ('" + username + "','" + itemId
						+ "','" + orderedquantity + "')";
				if (sql.storeData(query1) > 0) {
					returnVal = true;
				}
			}
			return returnVal;

		} catch (Exception e) {

			e.printStackTrace();
			return returnVal;
		}
	}
	
	public MyCart[] getMyCart(String username) {
		mysql sql = new mysql();
		boolean returnVal = false;
		try {
			String query = "select * from cart,items, userinfo where cart.itemId = items.itemId and items.owner = userinfo.username and cart.username = '" + username + "'";
			ResultSet rs = sql.fetchData(query);
			MyCart[] arrayMyCart = new MyCart[rs.getFetchSize()];
			int i = 0;
			if(rs.getFetchSize() > 0)
			{
			while(rs.next())
			{
				MyCart objMycart = new MyCart();
				objMycart.itemId = rs.getInt("itemId"); 
				objMycart.price = rs.getInt("price");
				objMycart.itemName = rs.getString("itemName");
				objMycart.description = rs.getString("description");
				objMycart.seller = rs.getString("seller"); 
				objMycart.orderedquantity = rs.getInt("orderedquantity");
				objMycart.availquantity = rs.getInt("availquantity");
				arrayMyCart[i] = objMycart;
				i++;
			}
			return arrayMyCart; 
			}
			else
			{
				return null;
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public boolean removeFromCart(String username,int itemId)
	{
		mysql sql = new mysql();
		boolean returnVal = false;
		try
		{
			String query= "delete from cart where username = '" + username + "' and itemId = '"+itemId+"'";
			if (sql.storeData(query) > 0) {
				returnVal = true;
			}
			return returnVal;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return returnVal;
		}
	}
	
	public boolean updateCart(String username,int itemId, int updatedquantity)
	{
		mysql sql = new mysql();
		boolean returnVal = false;
		try {
			
			String query = "update cart set orderedquantity = '" + updatedquantity + "' where username = '" + username + "' and itemId = '"+itemId+"'";
			if (sql.storeData(query) > 0) {
				returnVal = true;
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
