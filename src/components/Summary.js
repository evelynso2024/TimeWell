import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
);

function Summary() {
  const navigate = useNavigate();

  // Sample data - replace with your actual data
  const taskData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Impact Level',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Distribution by Impact Level',
      },
    },
  };

  return (
    <div>
      <Navigation />
      <Container className="mt-4">
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Total Time Tracked</Card.Title>
                <Card.Text>
                  120 hours
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text>
                  34 tasks
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Bar data={taskData} options={options} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Doughnut data={doughnutData} options={options} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Task Impact Distribution</Card.Title>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>High Impact</span>
                    <span>35%</span>
                  </div>
                  <ProgressBar variant="danger" now={35} />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Medium Impact</span>
                    <span>55%</span>
                  </div>
                  <ProgressBar variant="primary" now={55} />
                </div>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>Low Impact</span>
                    <span>10%</span>
                  </div>
                  <ProgressBar variant="warning" now={10} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Summary;
