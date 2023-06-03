import ac from "../Assets/Images/ac.png";
import tv from "../Assets/Images/television.png";
import projector from "../Assets/Images/projector.png";
import wifi from "../Assets/Images/wifi.png";

export const getIconBasedOnName = (name) => {
  const values = [
    "Air Conditioner",
    "Television with Satellite Channels",
    "Wi-Fi",
    "Portable Projector",
  ];

  switch (name) {
    case values[0]:
      return ac;

    case values[1]:
      return tv;

    case values[2]:
      return wifi;

    case values[3]:
      return projector;

    default:
      return "";
  }
};
