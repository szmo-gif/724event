import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);

  const filteredEvents = (
    data?.events?.filter(event => !type || event.type === type) || []
  );

  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={setType}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
