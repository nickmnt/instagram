
export default function FileInput() {

    const handleChange = e => {
        console.log(e.target.files);
    };

    return (

        <div class="file-input">
            <input type="file" id="file" class="file-input__input"
                accept="image/png, image/jpeg" onChange={handleChange} />
                <label htmlFor="file">
                    Select file
                <p class="file-input__file-name"></p>
            </label>
        </div>

    );

}