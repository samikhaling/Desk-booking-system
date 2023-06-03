export const getTotalRoomsBookedByUser = ({ userId, companies }) => {
  if (!userId || !companies || companies?.length === 0) return 0;

  const _floors = companies?.map((company) => {
    return { floors: company?.floors, companyName: company?.companyName };
  });

  const _rooms = _floors
    ?.map((floor) => {
      return floor?.floors?.map((item) =>
        item?.rooms?.map((room) => ({
          ...room,
          companyName: floor?.companyName,
        }))
      );
    })
    ?.flat(2);

  const roomBookedByUserOnly = _rooms?.filter(
    (room) => room?.bookedBy === userId
  );

  return {
    roomsBookedByUser: roomBookedByUserOnly || [],
    totalRoomBooked: roomBookedByUserOnly?.length,
  };
};
