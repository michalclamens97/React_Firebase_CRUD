import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
const LinkForm = (props) => {
  //Create an object with the initial values of my inputs, this are my properties(we pass this properties in the name atribute of the inputs)
  const initialStateValues = {
    url: "",
    name: "",
    description: "",
  };

  //Using the useState, the values is the object that have the properties and setValues is the function that we need to create to alter the values (the state)
  const [values, setValues] = useState(initialStateValues);

  //Fucntion that is going to save the values of the inputs everytime that we write something and is going to use the function setValues to alter the state(value) of the properties linked to the inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target; //I save in a const the name of the input that is being written on and the value
    //console.log(name, value);
    setValues({ ...values, [name]: value }); //...values means that is the propertie already have a value then copy it here and with [name]:value I'm saying to give the value that is being type in to the corresponding input(propertie) that is being type in with that value
  };

  const validURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validURL(values.url)) {
      return toast("invalid url", { type: "warning", autoClose: 1000 });
    }

    props.addOrEditLink(values);
    setValues({ ...initialStateValues });
  };
  //Get link by id
  const getLinkById = async (id) => {
    const doc = await db.collection("links").doc(id).get();
    //console.log(doc.data());
    setValues({ ...doc.data() });
  };

  //Useffect so everytime that the page reloads i checked if the property currentId (im getting this from Links.js via props) has a value, if it does has a value that means that the user cliked on the update option so i have to render the form in a different way
  useEffect(() => {
    if (props.currentId === "") {
      setValues({ ...initialStateValues }); //if currentId is emty then just initilize all the states(properties) as we have them in the cons initialValues
    } else {
      getLinkById(props.currentId);
      //console.log(props.currentId);
    }
  }, [props.currentId]);

  return (
    <form className="card card-body" onSubmit={handleSubmit}>
      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">insert_link</i>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="https://someurl.com"
          name="url"
          onChange={handleInputChange}
          value={values.url}
        />
      </div>

      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">create</i>
        </div>
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Website Name"
          onChange={handleInputChange}
          value={values.name}
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          rows="3"
          className="form-control"
          placeholder="Write a description"
          onChange={handleInputChange}
          value={values.description}
        ></textarea>
      </div>

      <button className="btn btn-primary btn-block">
        {props.currentId === "" ? "Save" : "Update"}
      </button>
    </form>
  );
};

export default LinkForm;
