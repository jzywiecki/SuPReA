
const TextStructure = ( { component, description, content } ) => {

    return (
        <div>
            <h1 className="text-3xl">{component}</h1>
            <p className="">{description}</p>
            <br></br>
            <p>{content}</p>
        </div>
    );
}

export default TextStructure;
