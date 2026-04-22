import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Typography, Row, Col, Avatar, Space, Tag, Divider, Card, Button } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, TagsOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Post } from './types';
import { defaultPosts, getLocalData, setLocalData } from './mockData';

const { Title, Paragraph, Text } = Typography;

export default function ChiTietBaiViet() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const allPosts = getLocalData<Post[]>('th07_posts', defaultPosts);
    const currentPostIndex = allPosts.findIndex(p => p.id === id);

    if (currentPostIndex > -1) {
      // Tăng view count
      const updatedPosts = [...allPosts];
      const currentPost = { ...updatedPosts[currentPostIndex] };
      currentPost.views += 1;
      updatedPosts[currentPostIndex] = currentPost;
      
      setLocalData('th07_posts', updatedPosts);
      setPost(currentPost);

      // Tìm bài viết liên quan (cùng thẻ, khác bài hiện tại)
      const related = updatedPosts.filter(p => 
        p.id !== id && 
        p.status === 'published' &&
        p.tags.some(tag => currentPost.tags.includes(tag))
      ).slice(0, 3); // Lấy tối đa 3 bài
      
      setRelatedPosts(related);
    } else {
      setPost(null);
    }
    
    // Tự scroll lên top khi load trang
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={3}>Không tìm thấy bài viết</Title>
        <Button onClick={() => history.push('/th07/trang-chu')}>Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => history.goBack()}
        style={{ marginBottom: 24, padding: 0 }}
      >
        Quay lại danh sách
      </Button>

      <div style={{ marginBottom: 32 }}>
        <Title level={1} style={{ fontSize: '2.5rem', marginBottom: 16 }}>{post.title}</Title>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar src={post.author.avatar} size="large" />
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Text strong>{post.author.name}</Text>
              <Space size="middle" style={{ color: '#8c8c8c' }}>
                <span><CalendarOutlined /> {moment(post.createdAt).format('DD/MM/YYYY')}</span>
                <span><EyeOutlined /> {post.views} lượt xem</span>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>

      <div>
        <img 
          src={post.coverImage} 
          alt={post.title} 
          style={{ width: '100%', borderRadius: 8, marginBottom: 32, maxHeight: 400, objectFit: 'cover' }} 
        />
      </div>

      <Typography>
        <Paragraph type="secondary" style={{ fontSize: 18, fontStyle: 'italic', borderLeft: '4px solid #1890ff', paddingLeft: 16 }}>
          {post.excerpt}
        </Paragraph>
        
        {/* Render "Markdown" hoặc HTML */}
        <div style={{ fontSize: 16, lineHeight: 1.8, marginTop: 32 }} dangerouslySetInnerHTML={{ __html: post.content }} />
      </Typography>

      <Divider style={{ margin: '48px 0 24px' }} />

      <div style={{ marginBottom: 48 }}>
        <Space size="middle">
          <Text strong><TagsOutlined /> Thẻ:</Text>
          {post.tags.map(tag => (
             <Tag color="blue" key={tag}>{tag}</Tag>
          ))}
        </Space>
      </div>

      {relatedPosts.length > 0 && (
        <div>
          <Title level={3}>Bài viết liên quan</Title>
          <Row gutter={[16, 16]}>
            {relatedPosts.map(rp => (
              <Col xs={24} sm={8} key={rp.id}>
                 <Card 
                  hoverable 
                  cover={<img alt={rp.title} src={rp.coverImage} style={{ height: 140, objectFit: 'cover' }} />}
                  bodyStyle={{ padding: 12 }}
                  onClick={() => history.push(`/th07/bai-viet/${rp.id}`)}
                >
                  <Title level={5} style={{ margin: 0, fontSize: 14 }}>
                    <span style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>
                      {rp.title}
                    </span>
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
