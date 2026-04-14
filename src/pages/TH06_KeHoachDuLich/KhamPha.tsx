import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Rate, Select, Slider, Typography, Tag } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const defaultData = [
  { id: 1, name: "Vịnh Hạ Long", location: "Quảng Ninh", type: "biển", rating: 5, price: 2500000, foodCost: 1000000, stayCost: 1000000, travelCost: 500000, timeToVisit: 24, description: "Kỳ quan thiên nhiên thế giới với hàng ngàn hòn đảo.", image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Sapa", location: "Lào Cai", type: "núi", rating: 4.8, price: 3000000, foodCost: 1000000, stayCost: 1200000, travelCost: 800000, timeToVisit: 48, description: "Thị trấn sương mù với những thửa ruộng bậc thang tuyệt đẹp.", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Tràng An", location: "Ninh Bình", type: "núi", rating: 4.7, price: 1500000, foodCost: 500000, stayCost: 700000, travelCost: 300000, timeToVisit: 12, description: "Quần thể danh thắng non nước hữu tình.", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Đà Nẵng", location: "Đà Nẵng", type: "thành phố", rating: 4.9, price: 4000000, foodCost: 1500000, stayCost: 1500000, travelCost: 1000000, timeToVisit: 72, description: "Thành phố đáng sống với những cây cầu nổi tiếng.", image: "https://images.unsplash.com/photo-1556608930-b30fb0d33e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Phú Quốc", location: "Kiên Giang", type: "biển", rating: 4.6, price: 5000000, foodCost: 2000000, stayCost: 2000000, travelCost: 1000000, timeToVisit: 48, description: "Đảo ngọc với những bãi biển cát trắng trải dài.", image: "https://images.unsplash.com/photo-1583416750470-965b2707b355?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

export default function KhamPha() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 10000000]);
  const [sortParam, setSortParam] = useState<string>('none');

  useEffect(() => {
    const localData = localStorage.getItem('th06_destinations');
    if (localData) {
      setDestinations(JSON.parse(localData));
    } else {
      localStorage.setItem('th06_destinations', JSON.stringify(defaultData));
      setDestinations(defaultData);
    }
  }, []);

  const filteredData = destinations.filter(item => {
    const matchType = filterType === 'all' || item.type === filterType;
    const price = item.price || 0;
    const matchPrice = price >= filterPrice[0] && price <= filterPrice[1];
    return matchType && matchPrice;
  }).sort((a, b) => {
    if (sortParam === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
    if (sortParam === 'rating_asc') return (a.rating || 0) - (b.rating || 0);
    if (sortParam === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortParam === 'price_desc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Khám phá điểm đến</Title>
      
      <Card style={{ marginBottom: 24, background: '#f8f9fa' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Text strong>Lọc theo Loại hình</Text>
            <Select value={filterType} onChange={setFilterType} style={{ width: '100%', marginTop: 8 }}>
              <Option value="all">Tất cả</Option>
              <Option value="biển">Biển đảo</Option>
              <Option value="núi">Núi non / Sông hồ</Option>
              <Option value="thành phố">Thành phố</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>Lọc theo Giá (VNĐ)</Text>
            <Slider 
                range 
                min={0} 
                max={10000000} 
                step={500000}
                value={filterPrice} 
                onChange={(val: any) => setFilterPrice(val as [number, number])} 
                style={{ marginTop: 8 }} 
            />
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>Sắp xếp danh sách</Text>
            <Select value={sortParam} onChange={setSortParam} style={{ width: '100%', marginTop: 8 }}>
              <Option value="none">Mặc định</Option>
              <Option value="rating_desc">Đánh giá: Cao đến thấp</Option>
              <Option value="rating_asc">Đánh giá: Thấp đến cao</Option>
              <Option value="price_asc">Giá: Thấp đến cao</Option>
              <Option value="price_desc">Giá: Cao đến thấp</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 24]}>
        {filteredData.map(item => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card 
              hoverable 
              cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
            >
              <Card.Meta title={item.name} description={item.location} />
              <div style={{ marginTop: 12 }}>
                <Tag color="cyan">{(item.type || 'KHÁC').toUpperCase()}</Tag>
                <Rate disabled defaultValue={item.rating || 0} style={{ fontSize: 12, display: 'block', margin: '8px 0' }} />
                <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '8px' }}>
                    {item.description?.length > 40 ? item.description.substring(0, 40) + '...' : item.description}
                </Text>
                <Text type="danger" strong>{(item.price || 0).toLocaleString()} VNĐ</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}