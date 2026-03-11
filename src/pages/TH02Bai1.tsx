import React, { useState } from 'react';
import { Card, Button, Typography, Space, Table, Tag, message } from 'antd';

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface HistoryRecord {
  id: number;
  player: Choice;
  computer: Choice;
  result: Result;
}

const CHOICES: Choice[] = ['Kéo', 'Búa', 'Bao'];

const TH02Bai1: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'Hòa';
    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }
    return 'Thua';
  };

  const handlePlay = (playerChoice: Choice) => {
    const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const result = determineWinner(playerChoice, computerChoice);

    const newRecord: HistoryRecord = {
      id: Date.now(),
      player: playerChoice,
      computer: computerChoice,
      result,
    };

    setHistory([newRecord, ...history]);

    if (result === 'Thắng') {
      message.success(`Bạn chọn ${playerChoice}, Máy chọn ${computerChoice}. Bạn Thắng!`);
    } else if (result === 'Thua') {
      message.error(`Bạn chọn ${playerChoice}, Máy chọn ${computerChoice}. Bạn Thua!`);
    } else {
      message.warning(`Bạn chọn ${playerChoice}, Máy chọn ${computerChoice}. Kết quả Hòa!`);
    }
  };

  const columns = [
    { 
      title: 'Lượt chơi', 
      dataIndex: 'id', 
      render: (_: any, __: any, index: number) => history.length - index 
    },
    { title: 'Bạn chọn', dataIndex: 'player' },
    { title: 'Máy chọn', dataIndex: 'computer' },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      render: (res: Result) => (
        <Tag color={res === 'Thắng' ? 'green' : res === 'Thua' ? 'red' : 'default'}>
          {res}
        </Tag>
      ),
    },
  ];

  return (
    <Card title="TH02 - Bài 1: Trò chơi Oẳn Tù Tì" style={{ maxWidth: 600, margin: '20px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Typography.Title level={4}>Chọn nước đi của bạn</Typography.Title>
        <Space size="large" style={{ marginTop: 10 }}>
          <Button size="large" type="primary" onClick={() => handlePlay('Kéo')}>✌️ Kéo</Button>
          <Button size="large" type="primary" danger onClick={() => handlePlay('Búa')}>✊ Búa</Button>
          <Button size="large" style={{ borderColor: 'green', color: 'green' }} onClick={() => handlePlay('Bao')}>✋ Bao</Button>
        </Space>
      </div>
      <Table 
        dataSource={history} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
        bordered
      />
    </Card>
  );
};

export default TH02Bai1;