import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CampaignSwitcher = ({ campaigns, currentCampaignId }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId && selectedId !== id) {
      navigate(`/campaigns/${selectedId}`);
    }
  };

  return (
    <div className="ml-auto">
      <label className="text-sm font-medium mr-2">Campaign:</label>
      <select
        value={currentCampaignId}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm"
      >
        {campaigns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampaignSwitcher;
