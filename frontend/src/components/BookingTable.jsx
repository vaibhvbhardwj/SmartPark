function BookingTable() {
  return (
    <table className="booking-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Vehicle</th>
          <th>Slot</th>
          <th>Duration</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John</td>
          <td>KA01AB1234</td>
          <td>A1</td>
          <td>2 hrs</td>
          <td>₹250</td>
        </tr>
        <tr>
          <td>Alex</td>
          <td>MH12XY4567</td>
          <td>B3</td>
          <td>1 hr</td>
          <td>₹150</td>
        </tr>
      </tbody>
    </table>
  );
}

export default BookingTable;
