import FileInput from '../components/file-input';
import PageTemplate from '../templates/page-template';


export default function Publish() {
    return (
        <PageTemplate>
            <div className="publish">
                <div className="publish__initial">
                    {/*<div className="publish__drop-container noselect">
                        Drop your picture here
                    </div>*/}
                    <div className="publish__file-input">
                        <FileInput/>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}