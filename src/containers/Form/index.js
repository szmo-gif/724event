import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => {
  setTimeout(resolve, 500);
});

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    type: "",
    email: "",
    message: "",
  });
  const [popup, setPopup] = useState({ show: false, message: "", success: false });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();

      setSending(true);
      try {
        await mockContactApi();
        setSending(false);
        setPopup({ show: true, message: "Le formulaire a été envoyé avec succès !", success: true });
        onSuccess();
      } catch (err) {
        setSending(false);
        setPopup({ show: true, message: "Une erreur s'est produite lors de l'envoi du formulaire.", success: false });
        onError(err);
      }
    },
    [formData, onSuccess, onError]
  );

  const closePopup = () => {
    setPopup({ show: false, message: "", success: false });
  };

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            value={formData.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
          />
          <Field
            placeholder=""
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => handleChange("prenom", e.target.value)}
          />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={(value) => handleChange("type", value)}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field
            placeholder=""
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
          />
        </div>
      </div>
      {popup.show && (
        <div className={`popup ${popup.success ? "success" : "error"}`}>
          <div className="popup-content">
            <p>{popup.message}</p>
            <button type="button" onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
