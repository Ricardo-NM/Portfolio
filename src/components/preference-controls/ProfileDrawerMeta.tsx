import { FolderCode, GraduationCap, Mail, MapPin } from "lucide-react";

type ProfileDrawerMetaProps = {
  educationText: string;
  profileEmail: string;
  profileLocation: string;
  projectsText: string;
};

export default function ProfileDrawerMeta({
  educationText,
  profileEmail,
  profileLocation,
  projectsText,
}: ProfileDrawerMetaProps) {
  return (
    <div className="profile-drawer-meta">
      <span>
        <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
        {profileEmail}
      </span>
      <span>
        <GraduationCap aria-hidden="true" size={16} strokeWidth={1.8} />
        <span className="profile-drawer-meta-text">{educationText}</span>
      </span>
      <span>
        <MapPin aria-hidden="true" size={16} strokeWidth={1.8} />
        <span className="profile-drawer-meta-text">{profileLocation}</span>
      </span>
      <span>
        <FolderCode aria-hidden="true" size={16} strokeWidth={1.8} />
        <span className="profile-drawer-meta-text">{projectsText}</span>
      </span>
    </div>
  );
}
