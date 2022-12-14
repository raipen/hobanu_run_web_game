package DAO;

import java.sql.*;
import java.util.LinkedList;
import java.util.List;

import DTO.*;

public class ItemDAO extends DAO
{
    private static ItemDAO instance;
    private Connection conn = null;
    private PreparedStatement pstmt = null;
    private ResultSet rs = null;

    private ItemDAO()
    {
    }

    public static ItemDAO getInstance()
    {
        if (instance == null) instance = new ItemDAO();

        return instance;
    }

    public boolean setItem(ItemDTO item){
        try
        {
            conn = getConnection();
            String sql = "UPDATE OWNS SET ITEMCOUNT = ? WHERE USERID = ? AND ITEMID = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, item.getItemCount());
            pstmt.setString(2, item.getId());
            pstmt.setString(3, item.getItemID());
            int result = pstmt.executeUpdate();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return false;
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return true;
    }
    
    public boolean useItem(String userId,String itemId){
        try
        {
            conn = getConnection();
            conn.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            System.out.println("qwer");
            String sql = "UPDATE OWNS SET ITEMCOUNT = ITEMCOUNT - 1 WHERE USERID = ? AND ITEMID = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, userId);
            pstmt.setString(2, itemId);
            int result = pstmt.executeUpdate();
            if(result == 0)
                return false;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return false;
        }
        finally
        {   
            closeConnection(conn, pstmt, rs);
        }
        return true;
    }

    public ItemDTO addItem(String userId,String itemId){
        try
        {
            conn = getConnection();
            conn.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            String sql = "SELECT ITEMCOUNT FROM OWNS WHERE USERID = ? AND ITEMID = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, userId);
            pstmt.setString(2, itemId);
            rs = pstmt.executeQuery();
            if(rs.next()){
                sql = "UPDATE OWNS SET ITEMCOUNT = ITEMCOUNT + 1 WHERE USERID = ? AND ITEMID = ?";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, userId);
                pstmt.setString(2, itemId);
                int result = pstmt.executeUpdate();
            }else{
                sql = "INSERT INTO OWNS VALUES(?,?,1)";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, userId);
                pstmt.setString(2, itemId);
                int result = pstmt.executeUpdate();
            }
            sql = "SELECT * FROM ITEMS WHERE ITEMID = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, itemId);
            rs = pstmt.executeQuery();
            if(rs.next()){
                ItemDTO item = new ItemDTO();
                item.setItemID(itemId);
                item.setItemName(rs.getString("ITEMNAME"));
                item.setItemImg(rs.getString("ITEMIMG"));
                return item;
            }
            return null;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return null;
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
    }

}