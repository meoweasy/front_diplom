import React, { useState, useEffect } from 'react';
import '../styles/schema.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

function SettingBlock(props) {
    const { number, header, expandedHeight, isFirst, isLast, onNext, isVisible } = props;
    const [isCollapsed, setIsCollapsed] = useState(!isVisible);

    useEffect(() => {
        setIsCollapsed(!isVisible);
    }, [isVisible]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleNextBlock = () => {
        onNext();
        setTimeout(toggleCollapse, 200);
    };

    return (
        <div className={`collapse-block ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <div className='header_set'>
                <div className='circle'>{number}</div>
                <div className='title_set'>{header}</div>
            </div>
            <div className="content" style={{ height: isVisible ? (isCollapsed ? '0' : expandedHeight) : '0' }}>
                {props.children}
                <div className='nav_btn_set'>
                    {!isFirst && (
                        <div className='backBtn' onClick={props.onPrev}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                    )}
                    {!isLast && (
                        <div className='nextBtn' onClick={handleNextBlock}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SettingBlock;