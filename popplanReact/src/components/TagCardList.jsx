/* eslint-disable react/prop-types */
import { Row, Col } from "react-bootstrap";
import EventCard from "./EventCard";
import eventList from "../data/eventList";

function TagCardList({ tag }) {
  const filteredEvents = eventList.filter((event) => event.tag === tag);

  return (
    <Row className="d-flex justify-content-center">
      {filteredEvents.map((event) => (
        <Col key={event.id} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-3">
          <EventCard event={event} />
        </Col>
      ))}
    </Row>
  );
}

export default TagCardList;

