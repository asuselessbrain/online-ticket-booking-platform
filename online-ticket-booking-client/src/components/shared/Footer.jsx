import { CiFacebook, CiInstagram, CiYoutube } from 'react-icons/ci';
import appleStore from '../../assets/images/apple.png'
import googlePlay from '../../assets/images/google_play.png'
import Logo from './Logo';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="text-white">
            <div className="bg-[#01602a]">
                <div className="max-w-[1440px] mx-auto py-12 flex flex-col md:flex-row justify-between px-2 2xl:px-0 gap-8">
                    <div className="space-y-0.5">
                        <p>Phone: 012345122321, 012345122321</p>
                        <p>24x7 Services</p>
                        <p className='max-w-md'>zafrabad, shankar, mohammadpur, 1207 oad #14-a, dhanmondi medical college hospital</p>
                    </div>
                    <ul className="space-y-0.5">
                        <li>About</li>
                        <li>Blog</li>
                        <li>FAQ</li>
                        <li>Contact</li>
                    </ul>
                    <ul className="space-y-0.5">
                        <li>Privacy</li>
                        <li>Refund Policy</li>
                        <li>Terms And Condition</li>
                    </ul>
                    <div>
                        <p>Download the app</p>
                        <div className='flex items-center gap-6 mt-6'>
                            <img src={appleStore} alt="Apple Store" />
                            <img src={googlePlay} alt="Google Play" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-[#03632d]'>
                <div className='max-w-[1440px] mx-auto flex items-center justify-between px-2 2xl:px-0 py-6 flex-col md:flex-row gap-6'> 
                    <div className='flex items-center gap-6 md:gap-10 lg:gap-20'>
                        <Logo />
                        <p>&copy; {new Date().getFullYear()} BUS365-All Rights Reserved</p>
                    </div>
                    <div className='flex items-center gap-6 md:gap-10 lg:gap-20'>
                        <h4 className='text-xl font-semibold'>Follow Us: </h4>
                        <div className='text-gray-600 flex items-center gap-2'>
                            <CiInstagram size={30} className='bg-white rounded-full p-1' />
                            <FaXTwitter size={30} className='bg-white rounded-full p-1' />
                            <CiFacebook size={30} className='bg-white rounded-full p-1' />
                            <CiYoutube size={30} className='bg-white rounded-full p-1' />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;