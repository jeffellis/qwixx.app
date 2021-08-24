import React from 'react';

import './Announcements.scss';

const Announcements = ({ messages }) => {
    if (!messages) {
        return null;
    }

    if (!(messages instanceof Array)) {
        messages = [messages];
    }

    return (
        <div className="AnnouncementContainer toast-container position-fixed p-3">
            {
                messages.length > 0 ?
                    messages.map((message) => {
                        return (
                            <div className="Announcement toast show end-0" key={message} role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="AnnouncementBody toast-body">
                                    {message}
                                </div>
                            </div>        
                    )}) : null
            }
        </div>
    );
};
                
export default Announcements;
