import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import "../index.css";
import metricDefinitionData from "./metricDefinition.json"

// Sample matchDefinition.json data


const { Content } = Layout;

const MetricDefinitions = () => {
  return (
    <Content style={{ padding: '15px' }}>
      <h1 className="mb-5" style={{fontSize:"18px", fontWeight:"500"}}>Metric Definitions</h1>
      <Row gutter={[16, 16]}>
        {metricDefinitionData.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              title={item.parameter}
              bordered={false}
              className="shadow-lg"
              style={{ minHeight: 300 }}
            >
              <p><strong>Definition:</strong> {item.Definition}</p>
              <p><strong>Calculation Logic:</strong> {item.CalculationLogic}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default MetricDefinitions;
