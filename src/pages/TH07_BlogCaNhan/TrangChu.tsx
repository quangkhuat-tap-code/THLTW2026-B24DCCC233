import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Typography, Tag, Pagination, Input, Space, Avatar, Divider } from 'antd';
import { SearchOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { Post, Tag as TagType } from './types';
import { defaultPosts, defaultTags, getLocalData } from './mockData';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;

export default function TrangChu() {
  const history = useHistory();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<TagType[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const pageSize = 9;

  useEffect(() => {
    const savedPosts = getLocalData<Post[]>('th07_posts', defaultPosts);
    const savedTags = getLocalData<TagType[]>('th07_tags', defaultTags);
    
    // Chỉ hiển thị bài đã đăng
    setPosts(savedPosts.filter(p => p.status === 'published'));
    setAllTags(savedTags);
  }, []);

  // Filter posts match search and selection
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchText.toLowerCase());
      const matchTag = selectedTag ? post.tags.includes(selectedTag) : true;
      return matchSearch && matchTag;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, searchText, selectedTag]);

  // Paginate
  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
    }
    setCurrentPage(1);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Blog Cá Nhân</Title>
          <Text type="secondary">Chia sẻ kiến thức, kinh nghiệm và góc nhìn</Text>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Input 
            placeholder="Tìm kiếm bài viết..." 
            prefix={<SearchOutlined />} 
            onChange={handleSearchChange}
            size="large"
            allowClear
          />
        </Col>
      </Row>

      <div style={{ marginBottom: 24 }}>
        <Space wrap>
          <Text strong>Lọc theo thẻ:</Text>
          <Tag 
            color={selectedTag === null ? 'blue' : 'default'} 
            style={{ cursor: 'pointer', padding: '4px 12px', fontSize: 14 }}
            onClick={() => handleTagClick(selectedTag as any)} // trick to clear
          >
            Tất cả
          </Tag>
          {allTags.map(tag => (
            <Tag 
              key={tag.id} 
              color={selectedTag === tag.name ? 'blue' : 'default'}
              style={{ cursor: 'pointer', padding: '4px 12px', fontSize: 14 }}
              onClick={() => handleTagClick(tag.name)}
            >
              {tag.name} ({tag.count})
            </Tag>
          ))}
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {currentPosts.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center', padding: 48 }}>
            <Text type="secondary">Không tìm thấy bài viết nào phù hợp.</Text>
          </Col>
        ) : (
          currentPosts.map(post => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <Card 
                hoverable 
                cover={<img alt={post.title} src={post.coverImage} style={{ height: 220, objectFit: 'cover' }} />}
                bodyStyle={{ padding: 20 }}
                onClick={() => history.push(`/th07/bai-viet/${post.id}`)}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ marginBottom: 12 }}>
                  {post.tags.map(tag => (
                    <Tag color="cyan" key={tag}>{tag}</Tag>
                  ))}
                </div>
                
                <Title level={4} style={{ marginBottom: 8, fontSize: 18, lineHeight: 1.4 }}>
                  <span style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {post.title}
                  </span>
                </Title>
                
                <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                  {post.excerpt}
                </Paragraph>
                
                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <Divider style={{ margin: '0 0 16px 0' }} />
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Space>
                        <Avatar src={post.author.avatar} size="small" />
                        <Text strong style={{ fontSize: 13 }}>{post.author.name}</Text>
                      </Space>
                    </Col>
                    <Col>
                      <Space size="small" style={{ fontSize: 12, color: '#8c8c8c' }}>
                        <span><CalendarOutlined /> {moment(post.createdAt).format('DD/MM/YYYY')}</span>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {filteredPosts.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination 
            current={currentPage} 
            total={filteredPosts.length} 
            pageSize={pageSize} 
            onChange={setCurrentPage} 
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
