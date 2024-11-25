// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
} from "@iconscout/react-unicons";

// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

// Recent Card Imports
import img1 from "../imgs/img1.png";
import img2 from "../imgs/img2.png";
import img3 from "../imgs/img3.png";

// Sidebar Data
export const SidebarData = [
  {
    icon: UilEstate,
    heading: "Dashboard",
    path: "/"
  },
  {
    icon: UilChart,
    heading: 'Breakdown',
    path: "/breakdown"
  },
  {
    icon: UilPackage,
    heading: "History",
     path: "/history"
  },
  {
    icon: UilMoneyWithdrawal,
    heading: "XAI",
    path: "/orders"
  },
  {
    icon: UilUsersAlt,
    heading: "Part to RM",
    path: "/ParttoRM"
  },
  {
    icon: UilClipboardAlt,
    heading: 'Input',
    path: "/Input"
  }

];

// Analytics Cards Data
export const cardsData = [
  {
    title: "Raw Material",
    color: {
      backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
    png: UilUsdSquare,
    series: [
      {
        name: "Raw Material",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "Special Processes",
    color: {
      backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
      boxShadow: "0px 10px 20px 0px #FDC0C7",
    },
    barValue: 80,
    value: "14,270",
    png: UilUsdSquare,
    series: [
      {
        name: "Special Processes",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    title: "Cutting Tools",
    color: {
      backGround:
      "linear-gradient(180deg, #7FE183 0%, #7FE183 100%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "4,270",
    png: UilUsdSquare,
    series: [
      {
        name: "Cutting Tools",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
  {
    title: "Assembly",
    color: {
      backGround:
        "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
      boxShadow: "0px 10px 20px 0px #F9D59B",
    },
    barValue: 60,
    value: "4,270",
    png: UilUsdSquare,
    series: [
      {
        name: "Assembly",
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// Recent Update Card Data
export const UpdatesData = [
  {
    img: img1,
    name: " Hindustan Aluminium Company",
    noti: "has confirmed your order of 500kg of ALuminium - 17-4PH.",
    time: "25 seconds ago",
  },
  {
    img: img2,
    name: "Jindal Stainless Limited",
    noti: "has confirmed your order of 250 kg of Stainless Steel.",
    time: "30 minutes ago",
  },
  {
    img: img3,
    name: "Dhanwant Metal Corporation",
    noti: "has confirmed your order of 250 kg of Ti AMS4911.",
    time: "2 hours ago",
  },
];
