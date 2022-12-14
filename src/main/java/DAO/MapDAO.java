package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.LinkedList;
import java.util.List;

import DTO.*;

public class MapDAO extends DAO
{
    private static MapDAO instance;
    private Connection conn = null;
    private PreparedStatement pstmt = null;
    private ResultSet rs = null;

    private MapDAO()
    {
    }

    public static MapDAO getInstance()
    {
        if (instance == null) instance = new MapDAO();

        return instance;
    }

    public List<MapDTO> getMapList()
    {
        List<MapDTO> mapList = new LinkedList<MapDTO>();
        try
        {
            conn = getConnection();
            pstmt = conn.prepareStatement("SELECT * FROM maps order by difficulty");
            rs = pstmt.executeQuery();
            while (rs.next())
            {
                mapList.add(new MapDTO(rs.getString("mapno"),
                        rs.getString("mapname"), rs.getString("backgroundimg"),
                        rs.getInt("mapsizex"), rs.getInt("mapsizey"),
                        rs.getInt("goalx"), rs.getInt("goaly"),
                        rs.getInt("difficulty")));
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return mapList;
    }

    public List<String> getBaseOfMap(int mapno)
    {
        List<String> baseList = new LinkedList<String>();

        try
        {
            conn = getConnection();
            String sql = "SELECT BASEID,\n" +
                    "       POSITIONX,\n" +
                    "       POSITIONY\n" +
                    "FROM BASES\n" +
                    "WHERE MAPNO = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, mapno);
            rs = pstmt.executeQuery();

            while (rs.next())
            {
                baseList.add(rs.getString("BASEID") + "-" +
                        rs.getInt("POSITIONX") + "-" +
                        rs.getInt("POSITIONY"));
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return baseList;
    }

    public List<String> getHurdleOfMap(int mapno)
    {
        List<String> clearCountList = new LinkedList<String>();

        try
        {
            conn = getConnection();
            String sql = "select hurdleid\r\n" + "from hurdles\r\n"
                    + "where mapno =?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, mapno);
            rs = pstmt.executeQuery();

            while (rs.next())
            {
                clearCountList.add("ID: " + rs.getString("hurdleid"));
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return clearCountList;
    }

    public List<String> getMapClearedUnder(int cleartime)
    {
        List<String> clearCountList = new LinkedList<String>();

        try
        {
            conn = getConnection();
            String sql = "select mapname, mapNo \r\n" + "from maps M\r\n"
                    + "where Exists (select * from records R where R.clearTime < ? and R.mapno = M.mapno)";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, cleartime * 60);
            rs = pstmt.executeQuery();

            while (rs.next())
            {
                clearCountList.add(rs.getString("mapNo") + "-" + rs.getString("mapname"));
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return clearCountList;
    }

    public List<String> getHardHurdle(int damage, int x, int y)
    {
        List<String> clearCountList = new LinkedList<String>();

        try
        {
            conn = getConnection();
            String sql = "select H.mapno, H.hurdleid, H.positionx, H.positiony\r\n"
                    + "from hurdles H\r\n"
                    + "where damage>=?\r\n" + "\r\n" + "union\r\n" + "\r\n"
                    + "select H.mapno, H.hurdleid, H.positionx, H.positiony\r\n"
                    + "from hurdles H\r\n"
                    + "where objsizex>? and objsizey>?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, damage);
            pstmt.setInt(2, x);
            pstmt.setInt(3, y);
            rs = pstmt.executeQuery();

            while (rs.next())
            {
                clearCountList.add(rs.getString("mapno") + "-" +
                        rs.getString("hurdleid") + "-" +
                        rs.getString("positionx") + "-" +
                        rs.getString("positiony"));
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return clearCountList;
    }

    public MapDTO getMapInfo(String mapNo)
    {
        MapDTO map = null;
        try
        {
            conn = getConnection();
            String sql = "SELECT * FROM MAPS WHERE MAPNO = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, mapNo);
            rs = pstmt.executeQuery();
            while (rs.next())
                map = new MapDTO(rs.getString("mapno"),
                        rs.getString("mapname"), rs.getString("backgroundimg"),
                        rs.getInt("mapsizex"), rs.getInt("mapsizey"),
                        rs.getInt("goalx"), rs.getInt("goaly"),
                        rs.getInt("difficulty"));
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            closeConnection(conn, pstmt, rs);
        }
        return map;
    }
}
