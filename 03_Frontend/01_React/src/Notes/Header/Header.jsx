import { Button, Form, FormControl } from "react-bootstrap"
import { Link } from "react-router-dom"


function Header() {
    return (

        <div bg="light" variant="light" className=" flex flex-row justify-between ">
            <div>
                <Link to="/" className="text-3xl no-underline text-blue-400 font-bold ">
                    React Notes
                </Link>
            </div>

            <div className="flex flex-row space-x-2">
                <Link to="/Formik" className="text-xl no-underline text-gray-600">
                    Formik
                </Link>
                <Link to="/Virtualised" className="text-xl no-underline text-gray-600">
                    Virtualised
                </Link>
                <Link to="/Query" className="text-xl no-underline text-gray-600">
                    Query
                </Link>
                <Link to="/Hooks" className="text-xl no-underline text-gray-600" >
                    Hooks
                </Link>
                <Link to="/Spring" className="text-xl no-underline text-gray-600">
                    Spring
                </Link>

                <Form className="flex flex-row">
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-primary">Search</Button>
                </Form>
            </div>
        </div>
    )
}

export default Header