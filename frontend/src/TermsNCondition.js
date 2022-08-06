import React from 'react';
import { Button, Modal } from "react-bootstrap";

function TermsNCondition(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Terms and Conditions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>

            All users must be of at least the age of 13, and agree to not use freeway for bad purpose.

            <br/>
            Conditions
            <br/>
            - We reserve the right to modify or terminate the Upload Files service for any reason, without notice at any time.
            <br/>- We reserve the right to alter these Terms of Use at any time.
            <br/>- We reserve the right to refuse service to anyone for any reason at any time.
            <br/>- We may, but have no obligation to, remove Content and accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Use.
            <br/>- If a user is found to be using Upload Files to host icons, smileys, buddy icons, forum avatars, forum badges, forum signature images, or any other graphic for website design all your images will be removed.
            <br/>
            <br/>

            Copyright Information
            <br/>


            Upload Files will review all copyright © infringement claims received and remove files found to have been upload or distributed in violation of any such laws. To make a valid claim you must provide Upload Files with the following information:
            <br/>- A physical or electronic signature of the copyright owner or the person authorized to act on its behalf;
            <br/>- A description of the copyrighted work claimed to have been infringed;
            <br/>- A description of the infringing material and information reasonably sufficient to permit Upload Files to locate the material;
            <br/>- Your contact information, including your address, telephone number, and email;
           <br/>
           <br/>
            Claims can be sent to us via the report abuse page.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default TermsNCondition;
