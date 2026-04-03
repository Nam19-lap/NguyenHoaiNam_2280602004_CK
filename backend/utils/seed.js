const bcrypt = require("bcrypt");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Tag = require("../models/Tag");

const seedDatabase = async () => {
  if (String(process.env.SEED_ON_START).toLowerCase() !== "true") {
    return;
  }

  if ((await User.countDocuments()) > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [admin, member] = await User.create([
    {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: "admin"
    },
    {
      name: "Member User",
      email: "user@example.com",
      passwordHash,
      role: "user"
    }
  ]);

  const project = await Project.create({
    name: "Website Revamp",
    description: "Launch the first collaborative project after setup.",
    members: [admin._id, member._id],
    createdBy: admin._id
  });

  const [frontendTag, urgentTag] = await Tag.create([
    {
      name: "Frontend",
      color: "#0ea5e9",
      createdBy: admin._id
    },
    {
      name: "Urgent",
      color: "#f97316",
      createdBy: admin._id
    }
  ]);

  await Task.create([
    {
      title: "Draft landing page copy",
      description: "Create the hero and CTA copy for the new site.",
      projectId: project._id,
      assignedTo: [member._id],
      status: "todo",
      priority: "high",
      tags: [frontendTag._id, urgentTag._id],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdBy: admin._id
    },
    {
      title: "Review navigation structure",
      description: "Validate the information architecture with the team.",
      projectId: project._id,
      assignedTo: [admin._id, member._id],
      status: "in progress",
      priority: "medium",
      tags: [frontendTag._id],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: admin._id
    }
  ]);
};

module.exports = {
  seedDatabase
};
