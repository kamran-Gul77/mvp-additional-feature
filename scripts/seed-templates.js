const { MongoClient } = require("mongodb");

// Sample data for seeding checklist templates
const templates = [
  {
    city: "NYC",
    businessType: "Food Truck",
    tasks: [
      { task: "Mobile Food Vendor License", renewal: "Annual" },
      { task: "Business License", renewal: "Biennial" },
      { task: "DCA License", renewal: "Annual" },
      { task: "Food Service Establishment Permit", renewal: "Annual" },
      { task: "Food Handler's License", renewal: "3 years" },
      { task: "Fire Department Permit", renewal: "Annual" },
      { task: "Commercial Vehicle Registration", renewal: "Annual" },
      { task: "Equipment Inspection", renewal: "6 months" },
      { task: "Propane Tank Certification", renewal: "Annual" },
      { task: "Workers' Compensation Insurance", renewal: "Annual" },
      { task: "General Liability Insurance", renewal: "Annual" },
      { task: "Parking Permit", renewal: "Daily" },
      { task: "Health Department Inspection", renewal: "6 months" },
      { task: "Commissary Kitchen Agreement", renewal: "Annual" },
      { task: "Sales Tax Registration", renewal: "N/A" },
    ],
  },
  {
    city: "Dallas",
    businessType: "Food Truck",
    tasks: [
      { task: "Mobile Food Unit Permit", renewal: "Annual" },
      { task: "Business License", renewal: "Annual" },
      { task: "Sales Tax Permit", renewal: "N/A" },
      { task: "Food Handler's License", renewal: "2 years" },
      { task: "Health Inspection", renewal: "6 months" },
      { task: "Fire Safety Inspection", renewal: "Annual" },
      { task: "Vending Location Permit", renewal: "Daily/Event" },
      { task: "Waste Disposal Agreement", renewal: "Annual" },
      { task: "Commissary Agreement", renewal: "Monthly" },
      { task: "Vehicle Registration", renewal: "Annual" },
      { task: "General Liability Insurance", renewal: "Annual" },
      { task: "Workers' Compensation Insurance", renewal: "Annual" },
    ],
  },
  {
    city: "LA",
    businessType: "Food Truck",
    tasks: [
      { task: "Business License (City)", renewal: "Annual" },
      { task: "Mobile Food Facility Permit", renewal: "Annual" },
      { task: "Reseller's Permit", renewal: "N/A" },
      { task: "County Health Permit", renewal: "Annual" },
      { task: "Food Manager Certification", renewal: "5 years" },
      { task: "Fire Department Inspection", renewal: "Annual" },
      { task: "Vending Route Permit", renewal: "Annual" },
      { task: "Commissary Kitchen Contract", renewal: "Monthly" },
      { task: "Workers' Compensation Insurance", renewal: "Annual" },
      { task: "General Liability Insurance", renewal: "Annual" },
      { task: "Vehicle Registration", renewal: "Annual" },
      { task: "Air Quality Management Permit", renewal: "Annual" },
      { task: "Parking Permit", renewal: "Daily" },
      { task: "Public Health License", renewal: "Annual" },
      { task: "Food Safety Certification", renewal: "3 years" },
      { task: "Equipment Compliance Check", renewal: "6 months" },
      { task: "Zoning Compliance Verification", renewal: "Annual" },
      { task: "Waste Management Contract", renewal: "Annual" },
    ],
  },
];

async function seedDatabase() {
  const client = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://kamran:kami8790@cluster0.xnvautt.mongodb.net/"
  );

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("compliance_buddy");
    const collection = db.collection("checklist_templates");

    // Clear existing templates
    await collection.deleteMany({});
    console.log("Cleared existing templates");

    // Insert new templates
    const result = await collection.insertMany(templates);
    console.log(`Inserted ${result.insertedCount} templates`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// Run the seeding function
seedDatabase();
