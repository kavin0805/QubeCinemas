import React, { useEffect, useState } from 'react';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu, Checkbox, Input, Tooltip } from 'antd';
import { getCollections } from '../services/Api'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';
import arrowLightUp from '../assets/img/arrow-light-up.png'
import arrowLightDown from '../assets/img/arrow-light-down.png'
import arrowDarkUp from '../assets/img/arrow-dark-up.png'
import arrowDarkDown from '../assets/img/arrow-dark-down.png'
import gif from '../assets/img/gif.gif'

const Collections = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchCollections();

    // Hide loading overlay after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
      setFilteredCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    filterCollections(text, selectedTypes);
  };

  const handleTypeFilter = (type, checked) => {
    const newSelectedTypes = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(newSelectedTypes);
    filterCollections(searchText, newSelectedTypes);
  };

  const filterCollections = (text, types) => {
    let filtered = collections.filter((collection) =>
      collection.name.toLowerCase().includes(text.toLowerCase())
    );

    if (types.length > 0) {
      filtered = filtered.filter((collection) => types.includes(collection.type));
    }

    setFilteredCollections(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...filteredCollections].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCollections(sortedData);
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

  const options = ['Album', 'EP', 'Single'];

  const menu = (
    <Menu>
      {options.map((option) => (
        <Menu.Item key={option}>
          <Checkbox
            checked={selectedTypes.includes(option)}
            onChange={(e) => handleTypeFilter(option, e.target.checked)}
          >
            {option}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="collections-container">

      <div className="header">Overview</div>

      {/* <img src={gif} /> */}
      <div className="table">
        <div className="filters">
          <Input
            style={{ width: '20%' }}
            size="small"
            placeholder="Search collections"
            suffix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
          />
          <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
            <Button size="small">
              Type{selectedTypes.length > 0 ? ` (${selectedTypes.length})` : ''}
            </Button>
          </Dropdown>
        </div>

        <table cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Collection Name {getArrow('name')}
              </th>
              <th onClick={() => handleSort('type')}>Type {getArrow('type')}</th>
              <th onClick={() => handleSort('songCount')}>
                Song Count {getArrow('songCount')}
              </th>
              <th onClick={() => handleSort('duration')}>
                Duration {getArrow('duration')}
              </th>
              <th onClick={() => handleSort('size')}>
                Size {getArrow('size')}
              </th>
              <th onClick={() => handleSort('releasedOn')}>
                Released On {getArrow('releasedOn')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollections.length > 0 ? (
              filteredCollections.map((collection) => (
                <tr key={collection.id}>
                  <td>
                    {collection.name} <br />
                    <span style={{ color: '#878787' }}>{collection.artist}</span>
                  </td>
                  <td>{collection.type}</td>
                  <td>{collection.songCount}</td>
                  <td>{collection.duration}</td>
                  <td>{collection.size}</td>
                  <td>{new Date(collection.releasedOn).toLocaleDateString()}</td>
                  <td>
                  {collection.name === "Collection Name" ? (
    <Tooltip title="Collection data unavailable">
      <span style={{ color: "#ccc", cursor: "not-allowed", display: "inline-block" }}>
        <EyeOutlined /> View Details
      </span>
    </Tooltip>
  ) : (
    <Link to={`/collections/${collection.id}`}>
      <EyeOutlined /> View Details
    </Link>
  )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <div className="loading-overlay">
            <img src={gif} alt="Loading..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;