package eBayWebService;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import utilities.mysql;

class BoughtSoldTransactions{
	
	int transactionId; 
	Date transactionDate; 
	int total;
	String buyer;
	String seller; 
	int itemId;
	int orderedquantity; 
}

public class HandlerDao {

	public BoughtSoldTransactions[] getBoughtTransactions(String username)
	{
		mysql sql = new mysql();
		boolean returnVal = false;
		try {

			String query = "select * from transaction,orders where buyer = '" + username
					+ "' and transaction.transactionId= orders.transactionId";

			ResultSet rs = sql.fetchData(query);
			if (rs.getFetchSize() > 0) {
				BoughtSoldTransactions[] arrayBoughtTransactions = new BoughtSoldTransactions[rs.getFetchSize()];
				int i = 0;
				while (rs.next()) {
					BoughtSoldTransactions objBoughtTransactions = new BoughtSoldTransactions();
					objBoughtTransactions.buyer = rs.getString("buyer");
					objBoughtTransactions.seller = rs.getString("seller");
					objBoughtTransactions.itemId = rs.getInt("itemId");
					objBoughtTransactions.transactionId = rs.getInt("transactionId");
					objBoughtTransactions.orderedquantity = rs.getInt("orderedquantity");
					objBoughtTransactions.transactionDate = rs.getDate("transactionDate");
					objBoughtTransactions.total = rs.getInt("total");
					arrayBoughtTransactions[i] = objBoughtTransactions;
					i++;
				}
				return arrayBoughtTransactions;
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
	
	
	public BoughtSoldTransactions[] getSoldTransactions(String username)
	{
		mysql sql = new mysql();
		boolean returnVal = false;
		try {
			String query = "select * from orders where seller = '"+username+"'";
			ResultSet rs = sql.fetchData(query);
			if (rs.getFetchSize() > 0) {
				BoughtSoldTransactions[] arrayBoughtTransactions = new BoughtSoldTransactions[rs.getFetchSize()];
				int i = 0;
				while (rs.next()) {
					BoughtSoldTransactions objBoughtTransactions = new BoughtSoldTransactions();
					objBoughtTransactions.seller = rs.getString("seller");
					objBoughtTransactions.itemId = rs.getInt("itemId");
					objBoughtTransactions.transactionId = rs.getInt("transactionId");
					objBoughtTransactions.orderedquantity = rs.getInt("orderedquantity");
					arrayBoughtTransactions[i] = objBoughtTransactions;
					i++;
				}
				return arrayBoughtTransactions;
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
