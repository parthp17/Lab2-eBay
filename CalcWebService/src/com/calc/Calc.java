package com.calc;

import javax.jws.WebService;

@WebService
public class Calc {
	
	public double add(double x, double y)
	{
		System.out.println(x +"+"+y);
		return x+y;
	}
	
	public double sub(double x, double y)
	{
		return x-y;
	}
	
	public double mul(double x, double y)
	{
		return x*y;
	}
	
	public double div(double x, double y)
	{
		double answer = 0;
		if(y!=0)
		{
			answer = x/y; 
		}
		return answer;
	}
}