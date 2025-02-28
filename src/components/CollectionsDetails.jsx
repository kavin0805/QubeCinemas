import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getCollectionDetails } from '../services/Api';
import { RightOutlined } from '@ant-design/icons';
import arrowLightUp from '../assets/img/arrow-light-up.png'
import arrowLightDown from '../assets/img/arrow-light-down.png'
import arrowDarkUp from '../assets/img/arrow-dark-up.png'
import arrowDarkDown from '../assets/img/arrow-dark-down.png'

const CollectionsDetails = () => {

  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [songsList, setSongsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getCollectionDetails(collectionId).then((data) => { setCollection(data); setSongsList(data.songs) });
  }, [collectionId]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...songsList].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSongsList(sortedData);
    setSortConfig({ key, direction });
  };

  const getArrow = (key) => {
    return (
      <span className="sort-arrows">
        {sortConfig.key === key && sortConfig.direction === 'asc' ? <img src={arrowDarkUp} alt='arrow' width={8} /> : <img src={arrowLightUp} alt='arrow' width={8} />}
        <br />
        {sortConfig.key === key && sortConfig.direction === 'desc' ? <img style={{ position: "absolute", bottom: -2 }} src={arrowDarkDown} alt='arrow' width={8} /> : <img style={{ position: "absolute", bottom: -2 }} src={arrowLightDown} alt='arrow' width={8} />}
      </span>
    );
  };

  return (
    <>
      {collection && <> <div style={{ fontSize: 10, padding: 10, cursor: "pointer" }}><span onClick={() => navigate('/')}>Overview</span>&nbsp;&nbsp; <RightOutlined />  &nbsp;&nbsp; {collection.name} </div> <div className="header">&nbsp;&nbsp;
        {collection.name}
      </div>
        <div className='details'>
          <div className='content'>
            Artist <br />
            <span style={{ color: "#878787" }}>{collection.artist}</span>
          </div>
          <div className='content'>
            Type <br />
            <span style={{ color: "#878787" }}>{collection.type}</span>
          </div>
          <div className='content'>
            Song Count <br />
            <span style={{ color: "#878787" }}>{collection.songCount}</span>
          </div>
          <div className='content'>
            Total Size <br />
            <span style={{ color: "#878787" }}>{collection.totalSize}</span>
          </div>
          <div className='content'>
            Total Duration<br />
            <span style={{ color: "#878787" }}>{collection.totalDuration}</span>
          </div>
          <div className='content'>
            Released On<br />
            <span style={{ color: "#878787" }}>{collection.releasedOn}</span>
          </div>
        </div>

        <div className="table" style={{ height: "auto" }}>
          <table cellPadding="10" cellSpacing="0" style={{ marginTop: 0 }}>
            <thead>
              <tr>
                <th onClick={() => handleSort('title')}>
                  Song {getArrow('title')}
                </th>
                <th onClick={() => handleSort('performers')}>
                  Performers {getArrow('performers')}
                </th>
                <th onClick={() => handleSort('duration')}>
                  Duration {getArrow('duration')}
                </th>
                <th onClick={() => handleSort('size')}>
                  Size {getArrow('size')}
                </th>
              </tr>
            </thead>
            <tbody>
              {songsList.length > 0 ? (
                songsList.map((songs, index) => (
                  <tr key={index}>
                    <td>{songs.title}</td>
                    <td style={{ width: "45%" }}>
                      {songs.performers.join(", ")}
                    </td>
                    <td>{songs.duration}</td>
                    <td>{songs.size}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div></>}
    </>
  )
}

export default CollectionsDetails