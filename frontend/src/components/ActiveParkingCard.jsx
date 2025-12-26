function ActiveParkingCard() {
  return (
    <div className="active-card">
      <h4>My Active Parking</h4>

      <div className="active-info">
        <div>
          <p><strong>Slot:</strong> B-12 Downtown</p>
          <p><strong>Vehicle:</strong> KA01AB1234</p>
          <p><strong>Cost:</strong> ₹150</p>
        </div>

        <div className="timer">
          <span>Time Remaining</span>
          <h2>01:23:45</h2>
          <button className="btn-release">Release Slot</button>
        </div>
      </div>
    </div>
  );
}

export default ActiveParkingCard;
