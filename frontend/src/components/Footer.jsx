function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} Smart Parking System</p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "15px",
    background: "#f2f2f2",
    marginTop: "40px"
  }
};

export default Footer;
