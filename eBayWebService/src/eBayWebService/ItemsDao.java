package eBayWebService;

import java.sql.ResultSet;

import eBayPOJO.Items;
import eBayPOJO.UsersInfo;
import utilities.mysql;

public class ItemsDao {
	public Items getItem(int itemId)
	{
		mysql sql = new mysql();
		boolean returnVal = false;
		try {
			String query = "select * from items,userinfo where itemId = '" + itemId + "' and items.owner = userinfo.username" ;
			System.out.println(query);
			ResultSet rs = sql.fetchData(query);
			if(rs.first())
			{
				Items objItems = new Items();
				objItems.setItemId(rs.getInt("itemId"));
				objItems.setDescription(rs.getString("description"));
				objItems.setItemName(rs.getString("itemName"));
				objItems.setPrice(rs.getInt("price"));
				objItems.setOwner(rs.getString("seller"));	
				return objItems;
			}
			else 
			{
				return null;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
}
