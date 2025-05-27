
import React, { useState, useEffect } from "react";
import styles from "../styles/style.module.css";


const Component = () => {
  const [warrantyNumber, setWarrantyNumber] = useState("");
  const [warrantyData, setWarrantyData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!warrantyNumber) {
      alert("Please enter a warranty number.");
      return;
    }
   
    try {
  console.log("🔍 Starting fetch for warrantyNumber:", warrantyNumber);

  const response = await fetch(
    `https://api.airtable.com/v0/appKvsuXgcddOMTjY/Warranty?filterByFormula={Warranty ID}='${warrantyNumber}'`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer pat6KvYTi3z5HO3oS.c7107d0658abf21d245b229ee1ff8b176092a0b251c8401a4dd9ee327353d9df",
        "Content-Type": "application/json",
      },
    }
  );

  console.log("📡 Response status code:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Airtable response error text:", errorText);
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  console.log("✅ Parsed response JSON:", data);

  if (data.records.length > 0) {
    const record = data.records[0].fields;
    console.log("📄 Found matching warranty record:", record);

    setWarrantyData({
      thumbnailImage: record["Thumbnail Image"] ? record["Thumbnail Image"][0].url : null,
      model: record["Model"],
      brand: record["Brand"],
      referenceNumber: record["Reference Number"],
      serialNumber: record["Serial Number"],
      band: record["Band"],
      dial: record["Dial"],
      purchaseDate: record["Purchase Date"],
      warrantyID: record["Warranty ID"],
      warrantyStart: record["Warranty Start"],
      warrantyEnd: record["Warranty End"],
      warrantyStatus: record["Warranty Status"],
    });
    setError(null);
  } else {
    console.warn("⚠️ No matching records found for Warranty ID:", warrantyNumber);
    setWarrantyData(null);
    setError("Warranty ID does not match our records");
  }
} catch (error) {
  console.error("💥 Error occurred during fetch:", error);
  setWarrantyData(null);
  setError("An error occurred while verifying warranty");
}

  };

  return (
    <div className={styles.container} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: "20px", minHeight: "auto" }}>
      <h2 style={{ color: "black", marginBottom: "8px", marginTop: "10px"}}>Certificate of Authenticity</h2>
      {!warrantyData ? (
        <>
          <p style={{ fontSize: "16px", color: "#0078B3", marginBottom: "16px", textAlign: "center"}}>
            Enter the 16-digit warranty code including dashes found on the back of your warranty card to view your watch details and/or to submit a claim.
          </p>
          {error && <p style={{ color: "red", marginBottom: "8px" }}>{error}</p>}
          <form className={styles.form} onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
              Enter your warranty code (required)
            </label>
            <input
              type="text"
              className={styles.input}
              value={warrantyNumber}
              onChange={(e) => setWarrantyNumber(e.target.value)}
              placeholder=" warranty number..."
              style={{
                borderRadius: "999px",
                padding: "12px 20px",
                border: "1px solid #ccc",
                width: "100%",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className={styles.button}
              style={{
                borderRadius: "999px",
                padding: "12px 20px",
                backgroundColor: "#0078B3",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                marginTop: "10px",
              }}
            >
              Verify Warranty
            </button>
          </form>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", border: "0px solid #ccc", borderRadius: "10px", backgroundColor: "#EAEAEE", width: "100%", maxWidth: "500px", minHeight: "auto" }}>
          {warrantyData.thumbnailImage && (
            <img src={warrantyData.thumbnailImage} alt="Product Thumbnail" style={{ maxWidth: "100%", height: "auto", borderRadius: "10px", marginBottom: "10px" }} />
          )}
          <h3 style={{ color: "#0078B3" }}>Warranty Details</h3>
          {warrantyData.model && <p><strong>Model:</strong> {warrantyData.model}</p>}
          {warrantyData.brand && <p><strong>Brand:</strong> {warrantyData.brand}</p>}
          {warrantyData.referenceNumber && <p><strong>Reference Number:</strong> {warrantyData.referenceNumber}</p>}
          {warrantyData.serialNumber && <p><strong>Serial Number:</strong> {warrantyData.serialNumber}</p>}
          {warrantyData.band && <p><strong>Band:</strong> {warrantyData.band}</p>}
          {warrantyData.dial && <p><strong>Dial:</strong> {warrantyData.dial}</p>}
          {warrantyData.purchaseDate && <p><strong>Purchase Date:</strong> {warrantyData.purchaseDate}</p>}
          {warrantyData.warrantyID && <p><strong>Warranty ID:</strong> {warrantyData.warrantyID}</p>}
          {warrantyData.warrantyStart && <p><strong>Warranty Start:</strong> {warrantyData.warrantyStart}</p>}
          {warrantyData.warrantyEnd && <p><strong>Warranty End:</strong> {warrantyData.warrantyEnd}</p>}
          {warrantyData.warrantyStatus && <p><strong>Warranty Status:</strong> {warrantyData.warrantyStatus}</p>}
            <button
            onClick={() => window.open(`https://airtable.com/appeE4S87yKBhZZyb/pagHWmb1h8vIiDfUr/form?prefill_WarrantyID=${encodeURIComponent(warrantyData.warrantyID)}`, '_blank')}
            className={styles.button}
            style={{
              marginTop: "20px",
              borderRadius: "999px",
              padding: "12px 20px",
              backgroundColor: "#0078B3",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
              maxWidth: "400px",
              fontFamily: "'Inter', sans-serif"
            
            }}
          >
            Submit Claim
          </button>
        </div>
      )}
    </div>
  );
};

export default Component;
