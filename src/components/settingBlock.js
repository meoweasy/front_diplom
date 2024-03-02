import React, { useState } from 'react';

function SettingBlock() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="collapse-block">
      <button onClick={toggleCollapse}>
        {isCollapsed ? 'Развернуть' : 'Свернуть'}
      </button>
      <div className={isCollapsed ? 'collapsed-content' : 'expanded-content'}>
        {isCollapsed ? null : (
          <p>
            Здесь может быть ваш контент
          </p>
        )}
      </div>
    </div>
  );
}

export default SettingBlock;