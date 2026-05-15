const portfolio = {
  experience: [
    {
      role: "Software Developer / Engineering Contributor",
      company: "Replace with current or most recent employer",
      period: "Month YYYY - Present",
      location: "City, State",
      summary:
        "Own application features across the delivery lifecycle, from requirements and design through implementation, testing, and release support.",
      bullets: [
        "Built and maintained production-ready features using Java, Spring-based services, SQL, and modern web technologies.",
        "Improved reliability by documenting workflows, refining error handling, and collaborating with cross-functional stakeholders.",
        "Translated business requirements into implementation plans, test cases, and maintainable technical deliverables."
      ]
    },
    {
      role: "Application Development Project",
      company: "SusruthProject",
      period: "Portfolio project",
      location: "Localhost",
      summary:
        "Created a professional web presence to communicate career history, achievements, projects, and resume positioning.",
      bullets: [
        "Designed a responsive portfolio interface with clear sections for experience, achievements, projects, and skills.",
        "Structured content so each bullet can be reused in resume, LinkedIn, or interview materials.",
        "Kept the implementation lightweight so it can run locally without a build tool or external dependency installation."
      ]
    }
  ],
  achievements: [
    {
      stat: "Impact",
      text: "Add a measurable result here, such as reduced processing time, improved quality, increased adoption, or delivered cost savings."
    },
    {
      stat: "Ownership",
      text: "Showcase a project, module, workflow, or business outcome where you were directly accountable for delivery."
    },
    {
      stat: "Growth",
      text: "Include certifications, academic milestones, leadership moments, awards, hackathons, or notable recognition."
    }
  ],
  projects: [
    {
      name: "CRUD Application Platform",
      type: "Java and web application",
      description:
        "A resume-friendly project area for describing a Java CRUD application with authentication, data models, validation, and database-backed workflows.",
      tools: ["Java", "Spring", "SQL", "REST APIs"]
    },
    {
      name: "Portfolio Resume Website",
      type: "Professional branding",
      description:
        "A responsive personal website that organizes career context into recruiter-friendly sections and links directly to LinkedIn.",
      tools: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    },
    {
      name: "Data and Reporting Workflow",
      type: "Editable sample",
      description:
        "Use this slot for a dashboard, automation, analytics, or reporting project that demonstrates business value and technical fluency.",
      tools: ["SQL", "Excel", "Power BI", "Python"]
    }
  ],
  skills: [
    "Java",
    "Spring Boot",
    "REST APIs",
    "SQL",
    "HTML",
    "CSS",
    "JavaScript",
    "CRUD Workflows",
    "Agile Delivery",
    "Testing",
    "Documentation",
    "Problem Solving"
  ]
};

const experienceList = document.querySelector("#experience-list");
const achievementList = document.querySelector("#achievement-list");
const projectList = document.querySelector("#project-list");
const skillList = document.querySelector("#skill-list");
const header = document.querySelector("[data-header]");

function renderExperience(items) {
  experienceList.innerHTML = items
    .map(
      (item) => `
        <article class="timeline-item">
          <div class="role-meta">
            <span>${item.company}</span>
            <span>${item.period}</span>
            <span>${item.location}</span>
          </div>
          <h3>${item.role}</h3>
          <p>${item.summary}</p>
          <ul class="bullet-list">
            ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderAchievements(items) {
  achievementList.innerHTML = items
    .map(
      (item) => `
        <article class="achievement-card">
          <strong>${item.stat}</strong>
          <span>${item.text}</span>
        </article>
      `
    )
    .join("");
}

function renderProjects(items) {
  projectList.innerHTML = items
    .map(
      (item) => `
        <article class="project-card">
          <div class="project-meta">
            <span>${item.type}</span>
            <span>${item.tools.join(" / ")}</span>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </article>
      `
    )
    .join("");
}

function renderSkills(items) {
  skillList.innerHTML = items.map((skill) => `<span>${skill}</span>`).join("");
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

renderExperience(portfolio.experience);
renderAchievements(portfolio.achievements);
renderProjects(portfolio.projects);
renderSkills(portfolio.skills);

document.querySelector("#year").textContent = new Date().getFullYear();
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
