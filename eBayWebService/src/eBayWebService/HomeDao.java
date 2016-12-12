package eBayWebService;

import java.sql.ResultSet;
import java.util.List;

import eBayPOJO.Items;
import utilities.mysql;

public class HomeDao {

	public Items[] getHomeValues(String username) {
		mysql sql = new mysql();
		try {
			String query = "select * from items where items.quantity > 0 and items.owner != '" + username + "'";
			ResultSet rs = sql.fetchData(query);
			Items[] arrayItems = new Items[rs.getFetchSize()];
			int i = 0;
			while (rs.next()) {
				Items objItems = new Items();
				objItems.setBidding(rs.getInt("isBidding"));
				objItems.setItemName(rs.getString("itemName"));
				objItems.setDescription(rs.getString("description"));
				objItems.setItemId(rs.getInt("itemId"));
				objItems.setPrice(rs.getInt("price"));
				objItems.setOwner(rs.getString("owner"));
				objItems.setQuantity(rs.getInt("quantity"));
				arrayItems[i] = objItems;
				i++;
			}
			return arrayItems;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
