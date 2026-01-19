import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const TeamSection = () => {
  const t = useTranslations("Team");
  const teamList: TeamProps[] = [
    // Executive
    {
      imageUrl: "https://i.pravatar.cc/250?img=32",
      firstName: t("members.sarah_jenkins.firstName"),
      lastName: t("members.sarah_jenkins.lastName"),
      positions: [t("roles.ceo")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=59",
      firstName: t("members.michael_obrien.firstName"),
      lastName: t("members.michael_obrien.lastName"),
      positions: [t("roles.operations")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    // Support
    {
      imageUrl: "https://i.pravatar.cc/250?img=12",
      firstName: t("members.marcus_taylor.firstName"),
      lastName: t("members.marcus_taylor.lastName"),
      positions: [t("roles.support")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=45",
      firstName: t("members.elena_rodriguez.firstName"),
      lastName: t("members.elena_rodriguez.lastName"),
      positions: [t("roles.support")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=20",
      firstName: t("members.olivia_brown.firstName"),
      lastName: t("members.olivia_brown.lastName"),
      positions: [t("roles.support")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    // Logistics & Compliance
    {
      imageUrl: "https://i.pravatar.cc/250?img=68",
      firstName: t("members.david_chen.firstName"),
      lastName: t("members.david_chen.lastName"),
      positions: [t("roles.logistics")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=36",
      firstName: t("members.james_wilson.firstName"),
      lastName: t("members.james_wilson.lastName"),
      positions: [t("roles.logistics")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=11",
      firstName: t("members.lucas_garcia.firstName"),
      lastName: t("members.lucas_garcia.lastName"),
      positions: [t("roles.logistics")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=23",
      firstName: t("members.sophia_muller.firstName"),
      lastName: t("members.sophia_muller.lastName"),
      positions: [t("roles.compliance")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=26",
      firstName: t("members.isabella_rossi.firstName"),
      lastName: t("members.isabella_rossi.lastName"),
      positions: [t("roles.compliance")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=15",
      firstName: t("members.ethan_hunt.firstName"),
      lastName: t("members.ethan_hunt.lastName"),
      positions: [t("roles.operations")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
    {
      imageUrl: "https://i.pravatar.cc/250?img=47",
      firstName: t("members.chloe_dubois.firstName"),
      lastName: t("members.chloe_dubois.lastName"),
      positions: [t("roles.logistics")],
      socialNetworks: [{ name: "LinkedIn", url: "#" }],
    },
  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
    }
  };

  return (
    <section id="team" className="container lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t("badge")}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teamList.map(
          (
            { imageUrl, firstName, lastName, positions, socialNetworks },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt=""
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {firstName}
                  <span className="text-primary ml-2">{lastName}</span>
                </CardTitle>
              </CardHeader>
              {positions.map((position, index) => (
                <CardContent
                  key={index}
                  className={`pb-0 text-muted-foreground ${
                    index === positions.length - 1 && "pb-6"
                  }`}
                >
                  {position}
                  {index < positions.length - 1 && <span>,</span>}
                </CardContent>
              ))}

              <CardFooter className="space-x-4 mt-auto">
                {socialNetworks.map(({ name, url }, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    className="hover:opacity-80 transition-all"
                  >
                    {socialIcon(name)}
                  </Link>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
