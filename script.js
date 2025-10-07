// Resume Builder State
document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggle = document.getElementById('dropdownToggle');
  const dropdownMenu = document.getElementById('dropdownMenu');

  const themesToggle = document.getElementById('themesToggle');
  const themesMenu = document.getElementById('themesMenu');

  const textSizeToggle = document.getElementById('textSizeToggle');
  const themeOptions = document.querySelectorAll('[data-theme]');
  const sizeOptions = document.querySelectorAll('[data-size]');
  const aboutBtn = document.querySelector('.AboutUs');
  const contactBtn = document.querySelector('.ContactUs');

  function closeAllMenus() {
    if (dropdownMenu) dropdownMenu.classList.remove('show');
    if (themesMenu) themesMenu.classList.remove('show');
  }

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
      if (themesMenu) themesMenu.classList.remove('show');
    });
  }

  if (themesToggle && themesMenu) {
    themesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      themesMenu.classList.toggle('show');
      if (dropdownMenu) dropdownMenu.classList.remove('show');
    });
  }

  document.addEventListener('click', (e) => {
    const clicked = e.target;
    if (dropdownMenu && dropdownToggle) {
      if (!dropdownMenu.contains(clicked) && !dropdownToggle.contains(clicked)) {
        dropdownMenu.classList.remove('show');
      }
    }
    if (themesMenu && themesToggle) {
      if (!themesMenu.contains(clicked) && !themesToggle.contains(clicked)) {
        themesMenu.classList.remove('show');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
  });

  // --- Theme switching & persistence ---
  if (themeOptions.length) {
    themeOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        const selected = opt.getAttribute('data-theme') || 'light';
        document.body.classList.remove('dark-theme', 'contrast-theme', 'reading-theme');
        if (selected !== 'light') {
          document.body.classList.add(`${selected}-theme`);
        }
        localStorage.setItem('pathfinder-theme', selected);
        if (themesMenu) themesMenu.classList.remove('show');
      });
    });
  }

  const savedTheme = localStorage.getItem('pathfinder-theme') || 'light';
  if (savedTheme && savedTheme !== 'light') {
    document.body.classList.add(`${savedTheme}-theme`);
  }

  const sizes = ['0.95rem', '1rem', '1.1rem', '1.2rem'];
  let sizeIndex = Number(localStorage.getItem('pathfinder-font-index')) || 1;

  function applySize(idx) {
    document.documentElement.style.fontSize = sizes[idx];
    localStorage.setItem('pathfinder-font-index', idx);
  }
  applySize(sizeIndex);

  if (textSizeToggle) {
    textSizeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      sizeIndex = (sizeIndex + 1) % sizes.length;
      applySize(sizeIndex);
    });
  }

  if (sizeOptions.length) {
    sizeOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = opt.getAttribute('data-size-index');
        const val = opt.getAttribute('data-size');
        if (idx !== null) {
          sizeIndex = Number(idx);
          applySize(sizeIndex);
        } else if (val) {
          document.documentElement.style.fontSize = val;
          localStorage.setItem('pathfinder-font-index', 'custom');
        }
        if (themesMenu) themesMenu.classList.remove('show');
        if (dropdownMenu) dropdownMenu.classList.remove('show');
      });
    });
  }

  if (aboutBtn) {
    aboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('about.html', '_blank', 'noopener,noreferrer');
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('contact.html', '_blank', 'noopener,noreferrer');
    });
  }
});

let currentSection = 'personal';
let selectedTemplate = 'modern';
let resumeData = {
    personal: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    photo: null
};

let experienceCount = 0;
let educationCount = 0;
let certificationCount = 0;
let languageCount = 0;
let projectCount = 0;

// Section order for navigation
const sections = ['personal', 'summary', 'experience', 'education', 'skills', 'additional'];

// Template names
const templateNames = {
    modern: 'Modern Professional',
    classic: 'Classic Executive',
    creative: 'Creative Designer'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    addFormListeners();
    updateTemplateDisplay();
    updatePreview();
    updateProgress();
});

// Start Builder
function startBuilder() {
    document.getElementById('welcome-section').classList.add('hidden');
    document.getElementById('builder-section').classList.remove('hidden');
    
    // Add initial items
    setTimeout(() => {
        addExperience();
        addEducation();
        updatePreview();
        updateProgress();
    }, 100);
}

// Template Selection
function selectTemplate(template) {
    selectedTemplate = template;
    
    // Update visual selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-template="${template}"]`).classList.add('selected');
    
    updateTemplateDisplay();
    updatePreview();
}

function selectTemplateFromModal(template) {
    selectTemplate(template);
    closeTemplateModal();
}

function changeTemplate() {
    document.getElementById('template-modal').classList.remove('hidden');
}

function closeTemplateModal() {
    document.getElementById('template-modal').classList.add('hidden');
}

function updateTemplateDisplay() {
    document.getElementById('template-name').textContent = templateNames[selectedTemplate];
    
    // Update template thumbnail
    const thumb = document.getElementById('template-thumb');
    thumb.className = `template-thumb ${selectedTemplate}-preview`;
}

// Section Navigation
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    currentSection = sectionName;
    updateNavigationButtons();
    updateProgress();
}

function nextSection() {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
        switchSection(sections[currentIndex + 1]);
    }
}

function previousSection() {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
        switchSection(sections[currentIndex - 1]);
    }
}

function updateNavigationButtons() {
    const currentIndex = sections.indexOf(currentSection);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentIndex === 0;
    
    if (currentIndex === sections.length - 1) {
        nextBtn.textContent = '✅ Complete Resume';
        nextBtn.onclick = completeResume;
    } else {
        nextBtn.textContent = 'Next Step →';
        nextBtn.onclick = nextSection;
    }
    
    // Update step counter
    document.getElementById('current-step').textContent = currentIndex + 1;
}

// Photo Upload Functions
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            resumeData.photo = e.target.result;
            
            // Show preview
            const preview = document.getElementById('photo-preview');
            const img = document.getElementById('photo-img');
            img.src = e.target.result;
            preview.classList.remove('hidden');
            
            // Hide upload area
            document.querySelector('.upload-placeholder').style.display = 'none';
            
            updatePreview();
            updateSectionStatus('personal');
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    resumeData.photo = null;
    document.getElementById('photo').value = '';
    document.getElementById('photo-preview').classList.add('hidden');
    document.querySelector('.upload-placeholder').style.display = 'block';
    updatePreview();
    updateSectionStatus('personal');
}

// Form Event Listeners
function addFormListeners() {
    // Personal information listeners
    const personalFields = ['firstName', 'lastName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'website'];
    personalFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', function() {
                resumeData.personal[field] = this.value;
                updatePreview();
                updateSectionStatus('personal');
            });
        }
    });
    
    // Summary listener
    const summaryField = document.getElementById('summary');
    if (summaryField) {
        summaryField.addEventListener('input', function() {
            resumeData.summary = this.value;
            updateCharacterCount('summary', this.value.length);
            updatePreview();
            updateSectionStatus('summary');
        });
    }
    
    // Skills input listener
    const skillInput = document.getElementById('skill-input');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
}

// Character Count Update
function updateCharacterCount(fieldName, count) {
    const countElement = document.getElementById(fieldName + '-count');
    if (countElement) {
        countElement.textContent = count;
        
        // Change color based on limit
        if (count > 280) {
            countElement.style.color = '#ef4444';
        } else if (count > 200) {
            countElement.style.color = '#f59e0b';
        } else {
            countElement.style.color = '#6b7280';
        }
    }
}

// Section Status Updates
function updateSectionStatus(sectionName) {
    const statusElement = document.getElementById(sectionName + '-status');
    let isComplete = false;
    
    switch (sectionName) {
        case 'personal':
            isComplete = resumeData.personal.firstName && resumeData.personal.lastName && 
                        resumeData.personal.jobTitle && resumeData.personal.email && 
                        resumeData.personal.phone;
            break;
        case 'summary':
            isComplete = resumeData.summary && resumeData.summary.length > 50;
            break;
        case 'experience':
            isComplete = resumeData.experience.length > 0;
            break;
        case 'education':
            isComplete = resumeData.education.length > 0;
            break;
        case 'skills':
            isComplete = resumeData.skills.length > 0;
            break;
        case 'additional':
            isComplete = resumeData.certifications.length > 0 || 
                        resumeData.languages.length > 0 || 
                        resumeData.projects.length > 0;
            break;
    }
    
    if (statusElement) {
        statusElement.textContent = isComplete ? '✓' : '○';
        statusElement.classList.toggle('completed', isComplete);
    }
}

// Progress Update
function updateProgress() {
    const completedSections = sections.filter(section => {
        const statusElement = document.getElementById(section + '-status');
        return statusElement && statusElement.classList.contains('completed');
    });
    
    const progress = (completedSections.length / sections.length) * 100;
    document.getElementById('completion-percentage').textContent = Math.round(progress);
    document.getElementById('progress-fill').style.width = progress + '%';
}

// Experience Management
function addExperience() {
    experienceCount++;
    const experienceList = document.getElementById('experience-list');
    
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.id = `experience-${experienceCount}`;
    
    experienceItem.innerHTML = `
        <div class="item-header">
            <div class="item-number">${experienceCount}</div>
            <button class="remove-item" onclick="removeExperience(${experienceCount})">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" id="exp-title-${experienceCount}" placeholder="Software Developer" required>
            </div>
            <div class="form-group">
                <label>Company *</label>
                <input type="text" id="exp-company-${experienceCount}" placeholder="Tech Corp" required>
            </div>
            <div class="form-group">
                <label>Start Date *</label>
                <input type="month" id="exp-start-${experienceCount}" required>
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" id="exp-end-${experienceCount}">
                <div class="field-tip">Leave empty if current position</div>
            </div>
            <div class="form-group full-width">
                <label>Location</label>
                <input type="text" id="exp-location-${experienceCount}" placeholder="New York, NY">
            </div>
            <div class="form-group full-width">
                <label>Description</label>
                <textarea id="exp-description-${experienceCount}" rows="4" placeholder="• Developed web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver projects on time&#10;• Improved application performance by 30%"></textarea>
                <div class="field-tip">Use bullet points to highlight achievements and quantify results</div>
            </div>
        </div>
    `;
    
    experienceList.appendChild(experienceItem);
    addExperienceListeners(experienceCount);
}

function addExperienceListeners(count) {
    const fields = ['title', 'company', 'start', 'end', 'location', 'description'];
    fields.forEach(field => {
        const element = document.getElementById(`exp-${field}-${count}`);
        if (element) {
            element.addEventListener('input', function() {
                updateExperienceData();
                updatePreview();
                updateSectionStatus('experience');
            });
        }
    });
}

function removeExperience(count) {
    const experienceItem = document.getElementById(`experience-${count}`);
    if (experienceItem) {
        experienceItem.remove();
        updateExperienceData();
        updatePreview();
        updateSectionStatus('experience');
    }
}

function updateExperienceData() {
    resumeData.experience = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    
    experienceItems.forEach(item => {
        const id = item.id.split('-')[1];
        const title = document.getElementById(`exp-title-${id}`)?.value || '';
        const company = document.getElementById(`exp-company-${id}`)?.value || '';
        const start = document.getElementById(`exp-start-${id}`)?.value || '';
        const end = document.getElementById(`exp-end-${id}`)?.value || '';
        const location = document.getElementById(`exp-location-${id}`)?.value || '';
        const description = document.getElementById(`exp-description-${id}`)?.value || '';
        
        if (title && company) {
            resumeData.experience.push({
                title, company, start, end, location, description
            });
        }
    });
}

// Education Management
function addEducation() {
    educationCount++;
    const educationList = document.getElementById('education-list');
    
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.id = `education-${educationCount}`;
    
    educationItem.innerHTML = `
        <div class="item-header">
            <div class="item-number">${educationCount}</div>
            <button class="remove-item" onclick="removeEducation(${educationCount})">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" id="edu-degree-${educationCount}" placeholder="Bachelor of Science" required>
            </div>
            <div class="form-group">
                <label>Field of Study *</label>
                <input type="text" id="edu-field-${educationCount}" placeholder="Computer Science" required>
            </div>
            <div class="form-group">
                <label>School *</label>
                <input type="text" id="edu-school-${educationCount}" placeholder="University of Technology" required>
            </div>
            <div class="form-group">
                <label>Graduation Year</label>
                <input type="number" id="edu-year-${educationCount}" placeholder="2023" min="1950" max="2030">
            </div>
            <div class="form-group">
                <label>GPA</label>
                <input type="text" id="edu-gpa-${educationCount}" placeholder="3.8/4.0">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="edu-location-${educationCount}" placeholder="Boston, MA">
            </div>
        </div>
    `;
    
    educationList.appendChild(educationItem);
    addEducationListeners(educationCount);
}

function addEducationListeners(count) {
    const fields = ['degree', 'field', 'school', 'year', 'gpa', 'location'];
    fields.forEach(field => {
        const element = document.getElementById(`edu-${field}-${count}`);
        if (element) {
            element.addEventListener('input', function() {
                updateEducationData();
                updatePreview();
                updateSectionStatus('education');
            });
        }
    });
}

function removeEducation(count) {
    const educationItem = document.getElementById(`education-${count}`);
    if (educationItem) {
        educationItem.remove();
        updateEducationData();
        updatePreview();
        updateSectionStatus('education');
    }
}

function updateEducationData() {
    resumeData.education = [];
    const educationItems = document.querySelectorAll('.education-item');
    
    educationItems.forEach(item => {
        const id = item.id.split('-')[1];
        const degree = document.getElementById(`edu-degree-${id}`)?.value || '';
        const field = document.getElementById(`edu-field-${id}`)?.value || '';
        const school = document.getElementById(`edu-school-${id}`)?.value || '';
        const year = document.getElementById(`edu-year-${id}`)?.value || '';
        const gpa = document.getElementById(`edu-gpa-${id}`)?.value || '';
        const location = document.getElementById(`edu-location-${id}`)?.value || '';
        
        if (degree && field && school) {
            resumeData.education.push({
                degree, field, school, year, gpa, location
            });
        }
    });
}

// Skills Management
function addSkill() {
    const skillInput = document.getElementById('skill-input');
    const skill = skillInput.value.trim();
    
    if (skill && !resumeData.skills.includes(skill)) {
        resumeData.skills.push(skill);
        skillInput.value = '';
        updateSkillsDisplay();
        updatePreview();
        updateSectionStatus('skills');
    }
}

function addSkillFromSuggestion(skill) {
    if (!resumeData.skills.includes(skill)) {
        resumeData.skills.push(skill);
        updateSkillsDisplay();
        updatePreview();
        updateSectionStatus('skills');
    }
}

function removeSkill(skill) {
    const index = resumeData.skills.indexOf(skill);
    if (index > -1) {
        resumeData.skills.splice(index, 1);
        updateSkillsDisplay();
        updatePreview();
        updateSectionStatus('skills');
    }
}

function updateSkillsDisplay() {
    const skillsDisplay = document.getElementById('skills-display');
    skillsDisplay.innerHTML = '';
    
    resumeData.skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button class="skill-remove" onclick="removeSkill('${skill}')">×</button>
        `;
        skillsDisplay.appendChild(skillTag);
    });
}

// Additional Sections Management
function switchAdditionalTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.additional-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function addCertification() {
    certificationCount++;
    const certificationsList = document.getElementById('certifications-list');
    
    const certificationItem = document.createElement('div');
    certificationItem.className = 'certification-item';
    certificationItem.id = `certification-${certificationCount}`;
    
    certificationItem.innerHTML = `
        <div class="item-header">
            <div class="item-number">${certificationCount}</div>
            <button class="remove-item" onclick="removeCertification(${certificationCount})">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Certification Name *</label>
                <input type="text" id="cert-name-${certificationCount}" placeholder="AWS Certified Developer" required>
            </div>
            <div class="form-group">
                <label>Issuing Organization *</label>
                <input type="text" id="cert-org-${certificationCount}" placeholder="Amazon Web Services" required>
            </div>
            <div class="form-group">
                <label>Issue Date</label>
                <input type="month" id="cert-date-${certificationCount}">
            </div>
            <div class="form-group">
                <label>Expiry Date</label>
                <input type="month" id="cert-expiry-${certificationCount}">
            </div>
        </div>
    `;
    
    certificationsList.appendChild(certificationItem);
    addCertificationListeners(certificationCount);
}

function addCertificationListeners(count) {
    const fields = ['name', 'org', 'date', 'expiry'];
    fields.forEach(field => {
        const element = document.getElementById(`cert-${field}-${count}`);
        if (element) {
            element.addEventListener('input', function() {
                updateCertificationData();
                updatePreview();
                updateSectionStatus('additional');
            });
        }
    });
}

function removeCertification(count) {
    const certificationItem = document.getElementById(`certification-${count}`);
    if (certificationItem) {
        certificationItem.remove();
        updateCertificationData();
        updatePreview();
        updateSectionStatus('additional');
    }
}

function updateCertificationData() {
    resumeData.certifications = [];
    const certificationItems = document.querySelectorAll('.certification-item');
    
    certificationItems.forEach(item => {
        const id = item.id.split('-')[1];
        const name = document.getElementById(`cert-name-${id}`)?.value || '';
        const org = document.getElementById(`cert-org-${id}`)?.value || '';
        const date = document.getElementById(`cert-date-${id}`)?.value || '';
        const expiry = document.getElementById(`cert-expiry-${id}`)?.value || '';
        
        if (name && org) {
            resumeData.certifications.push({ name, org, date, expiry });
        }
    });
}

function addLanguage() {
    languageCount++;
    const languagesList = document.getElementById('languages-list');
    
    const languageItem = document.createElement('div');
    languageItem.className = 'language-item';
    languageItem.id = `language-${languageCount}`;
    
    languageItem.innerHTML = `
        <div class="item-header">
            <div class="item-number">${languageCount}</div>
            <button class="remove-item" onclick="removeLanguage(${languageCount})">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Language *</label>
                <input type="text" id="lang-name-${languageCount}" placeholder="Spanish" required>
            </div>
            <div class="form-group">
                <label>Proficiency Level *</label>
                <select id="lang-level-${languageCount}" required>
                    <option value="">Select Level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                </select>
            </div>
        </div>
    `;
    
    languagesList.appendChild(languageItem);
    addLanguageListeners(languageCount);
}

function addLanguageListeners(count) {
    const fields = ['name', 'level'];
    fields.forEach(field => {
        const element = document.getElementById(`lang-${field}-${count}`);
        if (element) {
            element.addEventListener('input', function() {
                updateLanguageData();
                updatePreview();
                updateSectionStatus('additional');
            });
            element.addEventListener('change', function() {
                updateLanguageData();
                updatePreview();
                updateSectionStatus('additional');
            });
        }
    });
}

function removeLanguage(count) {
    const languageItem = document.getElementById(`language-${count}`);
    if (languageItem) {
        languageItem.remove();
        updateLanguageData();
        updatePreview();
        updateSectionStatus('additional');
    }
}

function updateLanguageData() {
    resumeData.languages = [];
    const languageItems = document.querySelectorAll('.language-item');
    
    languageItems.forEach(item => {
        const id = item.id.split('-')[1];
        const name = document.getElementById(`lang-name-${id}`)?.value || '';
        const level = document.getElementById(`lang-level-${id}`)?.value || '';
        
        if (name && level) {
            resumeData.languages.push({ name, level });
        }
    });
}

function addProject() {
    projectCount++;
    const projectsList = document.getElementById('projects-list');
    
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.id = `project-${projectCount}`;
    
    projectItem.innerHTML = `
        <div class="item-header">
            <div class="item-number">${projectCount}</div>
            <button class="remove-item" onclick="removeProject(${projectCount})">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Project Name *</label>
                <input type="text" id="proj-name-${projectCount}" placeholder="E-commerce Website" required>
            </div>
            <div class="form-group">
                <label>Technologies Used</label>
                <input type="text" id="proj-tech-${projectCount}" placeholder="React, Node.js, MongoDB">
            </div>
            <div class="form-group">
                <label>Project URL</label>
                <input type="url" id="proj-url-${projectCount}" placeholder="https://github.com/username/project">
            </div>
            <div class="form-group">
                <label>Date Completed</label>
                <input type="month" id="proj-date-${projectCount}">
            </div>
            <div class="form-group full-width">
                <label>Description</label>
                <textarea id="proj-description-${projectCount}" rows="3" placeholder="Built a full-stack e-commerce application with user authentication, payment processing, and admin dashboard"></textarea>
            </div>
        </div>
    `;
    
    projectsList.appendChild(projectItem);
    addProjectListeners(projectCount);
}

function addProjectListeners(count) {
    const fields = ['name', 'tech', 'url', 'date', 'description'];
    fields.forEach(field => {
        const element = document.getElementById(`proj-${field}-${count}`);
        if (element) {
            element.addEventListener('input', function() {
                updateProjectData();
                updatePreview();
                updateSectionStatus('additional');
            });
        }
    });
}

function removeProject(count) {
    const projectItem = document.getElementById(`project-${count}`);
    if (projectItem) {
        projectItem.remove();
        updateProjectData();
        updatePreview();
        updateSectionStatus('additional');
    }
}

function updateProjectData() {
    resumeData.projects = [];
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const id = item.id.split('-')[1];
        const name = document.getElementById(`proj-name-${id}`)?.value || '';
        const tech = document.getElementById(`proj-tech-${id}`)?.value || '';
        const url = document.getElementById(`proj-url-${id}`)?.value || '';
        const date = document.getElementById(`proj-date-${id}`)?.value || '';
        const description = document.getElementById(`proj-description-${id}`)?.value || '';
        
        if (name) {
            resumeData.projects.push({ name, tech, url, date, description });
        }
    });
}

// AI Suggestions
function applySuggestion(fieldName, suggestion) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.value = suggestion;
        field.dispatchEvent(new Event('input'));
    }
}

// Resume Preview Update
function updatePreview() {
    const previewContainer = document.getElementById('resume-preview');
    previewContainer.innerHTML = generateResumeHTML();
}

function generateResumeHTML() {
    const { personal, summary, experience, education, skills, certifications, languages, projects } = resumeData;
    
    let html = `<div class="resume-${selectedTemplate}">`;
    
    // Header
    html += `<div class="resume-header">`;
    
    if (selectedTemplate === 'classic') {
        // Classic layout with photo on left, info on right
        if (resumeData.photo) {
            html += `<img src="${resumeData.photo}" alt="Profile Photo" class="resume-photo">`;
        }
        html += `<div class="resume-info">`;
    } else {
        // Modern and Creative - centered layout
        if (resumeData.photo) {
            html += `<img src="${resumeData.photo}" alt="Profile Photo" class="resume-photo">`;
        }
    }
    
    if (personal.firstName || personal.lastName) {
        html += `<div class="resume-name">${personal.firstName || ''} ${personal.lastName || ''}</div>`;
    }
    if (personal.jobTitle) {
        html += `<div class="resume-title">${personal.jobTitle}</div>`;
    }
    
    // Contact info
    const contactInfo = [];
    if (personal.email) contactInfo.push(personal.email);
    if (personal.phone) contactInfo.push(personal.phone);
    if (personal.location) contactInfo.push(personal.location);
    if (personal.linkedin) contactInfo.push(personal.linkedin);
    if (personal.website) contactInfo.push(personal.website);
    
    if (contactInfo.length > 0) {
        html += `<div class="resume-contact">`;
        if (selectedTemplate === 'classic') {
            contactInfo.forEach(info => {
                html += `<div>${info}</div>`;
            });
        } else {
            html += contactInfo.join(' • ');
        }
        html += `</div>`;
    }
    
    if (selectedTemplate === 'classic') {
        html += `</div>`; // Close resume-info
    }
    
    html += `</div>`; // Close resume-header
    
    // Summary
    if (summary) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Professional Summary</div>
                <div>${summary}</div>
            </div>
        `;
    }
    
    // Experience
    if (experience.length > 0) {
        html += `<div class="resume-section">
            <div class="resume-section-title">Work Experience</div>`;
        
        experience.forEach(exp => {
            html += `<div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">${exp.title}</div>
                        <div class="resume-item-company">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                    </div>
                    <div class="resume-item-date">
                        ${formatDate(exp.start)} - ${exp.end ? formatDate(exp.end) : 'Present'}
                    </div>
                </div>
                ${exp.description ? `<div class="resume-item-description">${formatDescription(exp.description)}</div>` : ''}
            </div>`;
        });
        
        html += `</div>`;
    }
    
    // Education
    if (education.length > 0) {
        html += `<div class="resume-section">
            <div class="resume-section-title">Education</div>`;
        
        education.forEach(edu => {
            html += `<div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                        <div class="resume-item-company">${edu.school}${edu.location ? `, ${edu.location}` : ''}</div>
                    </div>
                    <div class="resume-item-date">
                        ${edu.year || ''}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                    </div>
                </div>
            </div>`;
        });
        
        html += `</div>`;
    }
    
    // Skills
    if (skills.length > 0) {
        html += `<div class="resume-section">
            <div class="resume-section-title">Skills</div>
            <div class="resume-skills">`;
        
        skills.forEach(skill => {
            html += `<span class="resume-skill">${skill}</span>`;
        });
        
        html += `</div></div>`;
    }
    
    // Certifications
    if (certifications.length > 0) {
        html += `<div class="resume-section">
            <div class="resume-section-title">Certifications</div>`;
        
        certifications.forEach(cert => {
            html += `<div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">${cert.name}</div>
                        <div class="resume-item-company">${cert.org}</div>
                    </div>
                    <div class="resume-item-date">
                        ${cert.date ? formatDate(cert.date) : ''}${cert.expiry ? ` - ${formatDate(cert.expiry)}` : ''}
                    </div>
                </div>
            </div>`;
        });
        
        html += `</div>`;
    }
    
    // Languages
    if (languages.length > 0) {
        html += `<div class="resume-section">
            <div class="resume-section-title">Languages</div>
            <div class="resume-skills">`;
        
        languages.forEach(lang => {
            html += `<span class="resume-skill">${lang.name} (${lang.level})</span>`;
        });
        
        html += `</div></div>`;
    }
    
    // Projects
    if (projects.length > 0) {
        html += `<div class="resume-section">
            <div class="resume-section-title">Projects</div>`;
        
        projects.forEach(proj => {
            html += `<div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">${proj.name}${proj.url ? ` (${proj.url})` : ''}</div>
                        ${proj.tech ? `<div class="resume-item-company">${proj.tech}</div>` : ''}
                    </div>
                    ${proj.date ? `<div class="resume-item-date">${formatDate(proj.date)}</div>` : ''}
                </div>
                ${proj.description ? `<div class="resume-item-description">${proj.description}</div>` : ''}
            </div>`;
        });
        
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function formatDescription(description) {
    return description.replace(/\n/g, '<br>');
}

// Complete Resume
function completeResume() {
    alert('🎉 Congratulations! Your resume is complete. You can now download it as a PDF or continue editing.');
}

// Download Resume as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    // Get resume content
    const resumeElement = document.getElementById('resume-preview');
    
    // Use html2canvas to convert HTML to canvas
    html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Generate filename
        const firstName = resumeData.personal.firstName || 'Resume';
        const lastName = resumeData.personal.lastName || 'CV';
        const filename = `${firstName}_${lastName}_Resume.pdf`;
        
        // Download the PDF
        pdf.save(filename);
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    });
}

