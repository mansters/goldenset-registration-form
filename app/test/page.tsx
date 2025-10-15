import Button from "@/components/Button";
import Col from "@/components/Col";
import Row from "@/components/Row";
import React from "react";

const TestPage = () => {
  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={1}>
          <div className="bg-yellow-300">Col-1</div>
        </Col>
        <Col span={2}>
          <div className="bg-yellow-300">Col-2</div>
        </Col>
        <Col span={3}>
          <div className="bg-yellow-300">Col-3</div>
        </Col>
        <Col span={4}>
          <div className="bg-yellow-300">Col-4</div>
        </Col>
        <Col span={5}>
          <div className="bg-yellow-300">Col-5</div>
        </Col>
        <Col span={6}>
          <div className="bg-yellow-300">Col-6</div>
        </Col>
        <Col span={7}>
          <div className="bg-yellow-300">Col-7</div>
        </Col>
        <Col span={8}>
          <div className="bg-yellow-300">Col-8</div>
        </Col>
        <Col span={9}>
          <div className="bg-yellow-300">Col-9</div>
        </Col>
        <Col span={10}>
          <div className="bg-yellow-300">Col-10</div>
        </Col>
        <Col span={11}>
          <div className="bg-yellow-300">Col-11</div>
        </Col>
        <Col span={12}>
          <div className="bg-yellow-300">Col-12</div>
        </Col>
        <Col span={13}>
          <div className="bg-yellow-300">Col-13</div>
        </Col>
        <Col span={14}>
          <div className="bg-yellow-300">Col-14</div>
        </Col>
        <Col span={15}>
          <div className="bg-yellow-300">Col-15</div>
        </Col>
        <Col span={16}>
          <div className="bg-yellow-300">Col-16</div>
        </Col>
        <Col span={17}>
          <div className="bg-yellow-300">Col-17</div>
        </Col>
        <Col span={18}>
          <div className="bg-yellow-300">Col-18</div>
        </Col>
        <Col span={19}>
          <div className="bg-yellow-300">Col-19</div>
        </Col>
        <Col span={20}>
          <div className="bg-yellow-300">Col-20</div>
        </Col>
        <Col span={21}>
          <div className="bg-yellow-300">Col-21</div>
        </Col>
        <Col span={22}>
          <div className="bg-yellow-300">Col-22</div>
        </Col>
        <Col span={23}>
          <div className="bg-yellow-300">Col-23</div>
        </Col>
        <Col span={24}>
          <div className="bg-yellow-300">Col-24</div>
        </Col>
      </Row>

      <div className="space-x-4">
        <Button>Click Me</Button>
        <Button type="primary">Click Me</Button>
        <Button disabled>Click Me</Button>
        <Button type="primary" disabled>
          Click Me
        </Button>
      </div>
    </div>
  );
};

export default TestPage;
