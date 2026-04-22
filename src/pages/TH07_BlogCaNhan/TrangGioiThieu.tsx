import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tag, Space, Divider, Button } from 'antd';
import { GithubOutlined, FacebookOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import { defaultAuthor } from './mockData';

const { Title, Paragraph, Text } = Typography;

export default function TrangGioiThieu() {
  const { name, avatar, bio, skills, socials } = defaultAuthor;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <Card bordered={false} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
        <Avatar src={avatar} size={150} style={{ border: '4px solid #1890ff', marginBottom: 24 }} />
        <Title level={2}>{name}</Title>
        <Text type="secondary" style={{ fontSize: 18, display: 'block', marginBottom: 24 }}>
          {bio}
        </Text>

        <Space size="large" style={{ marginTop: 16 }}>
          {socials?.github && (
            <Button type="text" icon={<GithubOutlined style={{ fontSize: 24 }} />} href={socials.github} target="_blank" />
          )}
          {socials?.facebook && (
            <Button type="text" icon={<FacebookOutlined style={{ fontSize: 24, color: '#1877F2' }} />} href={socials.facebook} target="_blank" />
          )}
          {socials?.linkedin && (
            <Button type="text" icon={<LinkedinOutlined style={{ fontSize: 24, color: '#0A66C2' }} />} href={socials.linkedin} target="_blank" />
          )}
          <Button type="text" icon={<MailOutlined style={{ fontSize: 24, color: '#EA4335' }} />} href="mailto:contact@example.com" />
        </Space>
      </Card>

      <Divider />

      <Row gutter={48}>
        <Col xs={24} md={12}>
          <Title level={3}>Về tôi</Title>
          <Paragraph style={{ fontSize: 16 }}>
            Xin chào! Tôi là một lập trình viên đam mê khám phá các công nghệ mới và chia sẻ kiến thức với cộng đồng. 
            Blog này được lập ra với mục đích lưu lại những chặng đường phát triển cá nhân cũng như những bài viết chuyên sâu về lập trình.
          </Paragraph>
          <Paragraph style={{ fontSize: 16 }}>
            Ngoài việc code dạo, tôi cũng thích đọc sách, nghe nhạc và đi du lịch để tìm thêm nguồn cảm hứng.
          </Paragraph>
        </Col>
        
        <Col xs={24} md={12}>
          <Title level={3}>Kỹ năng</Title>
          <div>
            {skills?.map(skill => (
              <Tag color="cyan" key={skill} style={{ padding: '6px 12px', fontSize: 14, margin: '0 8px 12px 0' }}>
                {skill}
              </Tag>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}
