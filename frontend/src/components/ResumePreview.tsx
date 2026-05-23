"use client";

import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Award } from "lucide-react";

interface ResumeJSON {
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    location?: string;
  };
  professional_summary?: string;
  skills?: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
  };
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
  }>;
  certifications?: string[];
}

export default function ResumePreview({ data }: { data: ResumeJSON }) {
  if (!data) return null;

  const { contact, professional_summary, skills, experience, education, certifications } = data;

  return (
    <div className="resume-preview animate-fade-in">
      {/* Contact Header */}
      {contact && (
        <div className="text-center mb-6 pb-5 border-b border-[var(--border)]">
          <h1 className="text-2xl font-bold mb-2">{contact.name}</h1>
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-[var(--muted-foreground)]">
            {contact.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-[var(--primary)]" />
                {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-[var(--primary)]" />
                {contact.phone}
              </span>
            )}
            {contact.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[var(--primary)]" />
                {contact.location}
              </span>
            )}
            {contact.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin size={13} className="text-[var(--primary)]" />
                <span className="truncate max-w-[200px]">{contact.linkedin}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {professional_summary && (
        <div className="mb-5">
          <h2>Professional Summary</h2>
          <p className="text-sm text-[var(--foreground)] leading-relaxed">{professional_summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && (Object.values(skills).some(arr => arr && arr.length > 0)) && (
        <div className="mb-5">
          <h2>Skills</h2>
          <div className="space-y-3">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Technical</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {skills.technical.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--accent)] text-[var(--primary)] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Soft Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {skills.soft.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Tools & Technologies</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {skills.tools.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--accent)] text-[var(--primary)] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2>
            <span className="flex items-center gap-2">
              <Briefcase size={14} />
              Professional Experience
            </span>
          </h2>
          <div className="space-y-5">
            {experience.map((exp, i) => (
              <div key={i} className="relative pl-4 border-l-2 border-[var(--border)]">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[var(--primary)]" />
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="font-semibold text-sm">{exp.title}</h3>
                  {exp.duration && (
                    <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap font-medium">{exp.duration}</span>
                  )}
                </div>
                {exp.company && (
                  <p className="text-xs text-[var(--primary)] font-medium mb-2">{exp.company}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1.5">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="text-xs text-[var(--foreground)] leading-relaxed flex items-start gap-2">
                        <span className="text-[var(--primary)] mt-1 flex-shrink-0">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2>
            <span className="flex items-center gap-2">
              <GraduationCap size={14} />
              Education
            </span>
          </h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{edu.institution}</p>
                </div>
                {edu.year && (
                  <span className="text-xs text-[var(--muted-foreground)] font-medium">{edu.year}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2>
            <span className="flex items-center gap-2">
              <Award size={14} />
              Certifications
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-lg glass border border-[var(--border)] font-medium">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
