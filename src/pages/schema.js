import React from "react";
import '../styles/schema.scss';
import SettingBlock from "../components/settingBlock";

const Schema = () => {
    return (
        <div>
            <div className="schema">
                <div className="schema_cont">
                    <div className="setting_block">
                        <div className="title_setting">Настройки</div>
                        <SettingBlock />

                    </div>
                    <div className="picture_block">

                    </div>
                </div>
            </div>
        </div>
      );
} 

export default Schema;