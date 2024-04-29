import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapStyles.css";
import { Icon } from "leaflet";
const Map = ({location}) => {
  // const [dbLocation, setDbLocation] = useState({
  //   //latitude and longitude
  //   latitude: 12.33892,
  //   longitude: 76.612219,
  // });                                  // In case the data changes and want to manipulate the data accordingly we can use state in the future
  const customIcon = new Icon({
    iconUrl: require("../Assets/mapIcon.png"),
    iconSize: [38, 38],
  });
  return (
    <MapContainer center={[location.latitude, location.longitude]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={[location.latitude, location.longitude]}
        icon={customIcon}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
