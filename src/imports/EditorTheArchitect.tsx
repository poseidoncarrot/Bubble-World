import svgPaths from "./svg-jua78vwoc8";
import imgAMajesticFantasyKingdomWithFloatingSpiresAndGlowingBlueLightsAtTwilight from "figma:asset/cd747509c5db95cb9bb4ffbf82c5668513179ed9.png";

function Container1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19.5">
        <g id="Container">
          <path d={svgPaths.p1382b180} fill="var(--fill-0, #AECDEB)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#395771] content-stretch flex items-center justify-center relative rounded-[48px] shrink-0 size-[40px]" data-name="Background">
      <Container1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#164e63] text-[14px] w-[75.77px]">
        <p className="leading-[20px]">Aethelgard</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-70 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[12px] w-[117.36px]">
        <p className="leading-[16px]">High Fantasy Setting</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[117.36px]" data-name="Container">
      <Heading1 />
      <Container3 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header Section">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[8px] py-[16px] relative w-full">
          <Background />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function HeaderSectionMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Header Section:margin">
      <HeaderSection />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p20803d40} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white tracking-[-0.35px] w-[65.28px]">
        <p className="leading-[20px]">New Entry</p>
      </div>
    </div>
  );
}

function ButtonCta() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#214059] gap-[8px] items-center justify-center px-[81.36px] py-[12px] relative rounded-[48px] shrink-0 to-[#395771]" data-name="Button - CTA">
      <Container4 />
      <Container5 />
    </div>
  );
}

function ButtonCtaMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0" data-name="Button - CTA:margin">
      <ButtonCta />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 16.6667">
        <g id="Container">
          <path d={svgPaths.p24cbd000} fill="var(--fill-0, #164E63)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#164e63] text-[14px] w-[76.47px]">
        <p className="leading-[20px]">World Bible</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(207,250,254,0.5)] relative rounded-[48px] shrink-0 w-full" data-name="Overlay">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container7 />
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#a5f3fc] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pl-[14px] pr-[12px] py-[6px] relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#0e7490] text-[12px] w-[135.63px]">
          <p className="leading-[16px]">The Kingdom of Eldoria</p>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[12px] py-[6px] relative w-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] w-full">
          <p className="leading-[16px]">{`History & Origin`}</p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[12px] py-[6px] relative w-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] w-full">
          <p className="leading-[16px]">Political Structure</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[220px]" data-name="Container">
      <VerticalBorder />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full" data-name="Container">
      <Overlay />
      <Container9 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p3f23d700} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[73.83px]">
        <p className="leading-[20px]">Characters</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container13 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p21559b80} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[65.25px]">
        <p className="leading-[20px]">Locations</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container16 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p3fce8400} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[57.03px]">
        <p className="leading-[20px]">Timeline</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container19 />
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[18.333px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333">
        <g id="Container">
          <path d={svgPaths.p3ca8ed80} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[57.16px]">
        <p className="leading-[20px]">Artifacts</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function NavigationTreeView() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px overflow-clip relative w-full" data-name="Navigation Tree View">
      <Container6 />
      <Container12 />
      <Container15 />
      <Container18 />
      <Container21 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[16.667px] relative shrink-0 w-[16.75px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.75 16.6667">
        <g id="Container">
          <path d={svgPaths.p18e22d80} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[54.92px]">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container25 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[37.61px]">
        <p className="leading-[20px]">Trash</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative w-full">
          <Container28 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function FooterTabs() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pt-[16px] relative shrink-0 w-full" data-name="Footer Tabs">
      <Container24 />
      <Container27 />
    </div>
  );
}

function AsideSidebarShellFixedLeft() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(248,250,252,0.7)] content-stretch flex flex-col gap-[8px] h-[1088px] items-start left-0 p-[16px] top-[64px] w-[288px]" data-name="Aside - Sidebar Shell (Fixed Left)">
      <HeaderSectionMargin />
      <ButtonCtaMargin />
      <NavigationTreeView />
      <FooterTabs />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[11px] tracking-[1.1px] uppercase w-[85.88px]">
        <p className="leading-[16.5px]">World Bible</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[7px] relative shrink-0 w-[4.317px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.31667 7">
        <g id="Container">
          <path d={svgPaths.p35022f90} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#214059] text-[11px] tracking-[1.1px] uppercase w-[170.98px]">
        <p className="leading-[16.5px]">The Kingdom of Eldoria</p>
      </div>
    </div>
  );
}

function PageBreadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Page Breadcrumbs">
      <Container31 />
      <Container32 />
      <Container33 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Manrope:Extra_Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#191c1d] text-[56px] tracking-[-2.8px] w-full">
        <p className="leading-[70px]">The Kingdom of Eldoria</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[20px] w-full">
        <p className="leading-[32.5px] mb-0">A bastion of magic and stone rising from the Shattered Coast, defined by its eternal</p>
        <p className="leading-[32.5px]">twilight and the Great Spires.</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Header">
      <Heading />
      <Container34 />
    </div>
  );
}

function AMajesticFantasyKingdomWithFloatingSpiresAndGlowingBlueLightsAtTwilight() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="A majestic fantasy kingdom with floating spires and glowing blue lights at twilight">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[250%] left-0 max-w-none top-[-75%] w-full" src={imgAMajesticFantasyKingdomWithFloatingSpiresAndGlowingBlueLightsAtTwilight} />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p2cbc1080} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.2)] bottom-[24px] content-stretch flex gap-[7.99px] items-center px-[17px] py-[9px] right-[24px] rounded-[9999px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container35 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white w-[82.66px]">
        <p className="leading-[16px]">Change Cover</p>
      </div>
    </div>
  );
}

function HeroImageSection() {
  return (
    <div className="bg-[#f3f4f5] content-stretch flex flex-col h-[320px] items-start justify-center overflow-clip relative rounded-[48px] shadow-[0px_12px_40px_0px_rgba(25,28,29,0.06)] shrink-0 w-full" data-name="Hero Image Section">
      <AMajesticFantasyKingdomWithFloatingSpiresAndGlowingBlueLightsAtTwilight />
      <div className="absolute bg-gradient-to-t from-[rgba(33,64,89,0.4)] inset-0 to-[rgba(33,64,89,0)]" data-name="Gradient" />
      <Button />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p3a7f8c20} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center opacity-0 p-[4px] relative shrink-0" data-name="Button">
      <Container36 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#214059] text-[24px] w-[283.39px]">
        <p className="leading-[32px]">History of the First Dawn</p>
      </div>
      <Button1 />
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="absolute border-[rgba(57,87,113,0.2)] border-b border-solid h-[21px] left-[209.97px] top-[6px] w-[150.13px]" data-name="HorizontalBorder">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] left-0 not-italic text-[#395771] text-[16px] top-[10px] w-[150.13px]">
        <p className="leading-[32px]">Great Convergence</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] left-0 not-italic text-[#44474c] text-[16px] top-[16px] w-[209.97px]">
        <p className="leading-[32px]">{`Founded in the wake of the `}</p>
      </div>
      <HorizontalBorder />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] left-[360.09px] not-italic text-[#44474c] text-[16px] top-[16px] w-[411.36px]">
        <p className="leading-[32px]">, Eldoria was originally a collection of scattered fishing</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[64px] justify-center leading-[0] left-0 not-italic text-[#44474c] text-[16px] top-[64px] w-[728.19px]">
        <p className="mb-0">
          <span className="leading-[32px]">{`villages. It was the discovery of `}</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[32px] not-italic">Aetherite</span>
          <span className="leading-[32px]">{` crystals in the deep caverns of the Iron Mountains that`}</span>
        </p>
        <p className="leading-[32px]">transformed it into the continental superpower it is today.</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[16px] w-full">
        <p className="leading-[32px] mb-0">Under the reign of King Alaric the Wise, the first of the Great Spires was constructed, bridging the gap</p>
        <p className="leading-[32px] mb-0">between arcane research and civil architecture. Today, the kingdom stands as a testament to what is</p>
        <p className="leading-[32px]">possible when magic and engineering exist in perfect harmony.</p>
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading2 />
      <Container37 />
      <Container38 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#164e63] text-[18px] w-full">
        <p className="leading-[28px]">Current Governance</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[14px] w-full">
        <p className="leading-[22.75px] mb-0">The Council of Seven Spires oversees the daily operations of the</p>
        <p className="leading-[22.75px] mb-0">kingdom. Each Councilor represents a specific school of magic and a</p>
        <p className="leading-[22.75px]">major city district.</p>
      </div>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-white col-[1/span_8] justify-self-stretch relative rounded-[32px] row-1 self-start shadow-[0px_12px_40px_0px_rgba(25,28,29,0.06)] shrink-0" data-name="Background+Shadow">
      <div className="content-stretch flex flex-col gap-[14.75px] items-start p-[32px] relative w-full">
        <Heading3 />
        <Container39 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[18px] relative shrink-0 w-[36px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 18">
        <g id="Container">
          <path d={svgPaths.p4182b00} fill="var(--fill-0, #AECDEB)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0" data-name="Margin">
      <Container40 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[#aecdeb] text-[24px] text-center w-[51.66px]">
        <p className="leading-[32px]">1.2M</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-center opacity-70 relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#aecdeb] text-[10px] text-center tracking-[1px] uppercase w-[73.89px]">
        <p className="leading-[20px]">Population</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#395771] col-[9/span_4] justify-self-stretch relative rounded-[32px] row-1 self-start shrink-0" data-name="Background">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center pb-[38.12px] pt-[38.13px] px-[32px] relative w-full">
          <Margin />
          <Container41 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function BentoLayoutForAttributes() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_176.25px] relative shrink-0 w-full" data-name="Bento Layout for Attributes">
      <BackgroundShadow />
      <Background1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#214059] text-[24px] w-full">
        <p className="leading-[32px]">Demographics</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pt-[4px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#0891b2] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Item">
      <Margin1 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[16px] w-[569.47px]">
        <p className="leading-[32px]">60% Humans: Primarily concentrated in the Lower Districts and trade hubs.</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pt-[4px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#0891b2] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Item">
      <Margin2 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[16px] w-[630.33px]">
        <p className="leading-[32px]">25% Elven Artisans: Master weavers and crystal smiths residing in the Silver Grove.</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pt-[4px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-[#0891b2] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Item">
      <Margin3 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#44474c] text-[16px] w-[441.91px]">
        <p className="leading-[32px]">15% Other: Including visiting scholars and nomadic druids.</p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
      <Item2 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading4 />
      <List />
    </div>
  );
}

function ArticleEditorBody() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full" data-name="Article - Editor Body">
      <Section />
      <BentoLayoutForAttributes />
      <Section1 />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full" data-name="Main Content Area">
      <Header />
      <HeroImageSection />
      <ArticleEditorBody />
    </div>
  );
}

function Container30() {
  return (
    <div className="max-w-[896px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] pb-[128px] pt-[96px] px-[48px] relative w-full">
        <PageBreadcrumbs />
        <MainContentArea />
      </div>
    </div>
  );
}

function MainCanvas() {
  return (
    <div className="flex-[1_0_0] h-[1567.75px] min-h-px min-w-px relative" data-name="Main Canvas">
      <div className="content-stretch flex flex-col items-start px-[48px] relative size-full">
        <Container30 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[1088px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center pl-[288px] pt-[64px] relative size-full">
          <AsideSidebarShellFixedLeft />
          <MainCanvas />
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#164e63] text-[20px] tracking-[-1px] w-[118.83px]">
        <p className="leading-[28px]">The Architect</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6px] relative shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#0e7490] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#0e7490] text-[14px] tracking-[-0.35px] w-[36.11px]">
        <p className="leading-[20px]">Editor</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#64748b] text-[14px] tracking-[-0.35px] w-[26.8px]">
        <p className="leading-[20px]">Map</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Link />
      <Link1 />
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.pf778600} fill="var(--fill-0, #164E63)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container47 />
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #164E63)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container48 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex gap-[15.99px] items-center relative shrink-0" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function TopNavigationBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0.7)] content-stretch flex items-center justify-between left-0 px-[24px] py-[12px] shadow-[0px_12px_40px_0px_rgba(25,28,29,0.06)] top-0 w-[1280px]" data-name="Top Navigation Bar">
      <Container43 />
      <Container46 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[10.667px] relative shrink-0 w-[14.667px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 10.6667">
        <g id="Container">
          <path d={svgPaths.pfe6fc80} fill="var(--fill-0, #0891B2)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#0891b2] text-[10px] tracking-[1px] uppercase w-[79.124px]">
        <p className="leading-[15px]">Sync: Ready</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative" data-name="Container">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Container">
          <path d={svgPaths.p1ef68040} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] tracking-[1px] uppercase w-[148.72px]">
        <p className="leading-[15px]">{`Recent: King's Landing`}</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] items-center left-[404.11px] top-1/2" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Container">
          <path d={svgPaths.p3256e600} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] tracking-[1px] uppercase w-[135.25px]">
        <p className="leading-[15px]">Recent: Dragon Lore</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] items-center left-[745.48px] top-1/2" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Container">
          <path d={svgPaths.p7fd0c80} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] tracking-[1px] uppercase w-[50.28px]">
        <p className="leading-[15px]">History</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] items-center left-[1073.39px] top-1/2" data-name="Container">
      <Container59 />
      <Container60 />
    </div>
  );
}

function FooterContextualStatusBar() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.8)] bottom-0 h-[32px] left-0 rounded-tl-[48px] rounded-tr-[48px] shadow-[0px_-8px_30px_0px_rgba(0,0,0,0.04)] w-[1280px]" data-name="Footer - Contextual Status Bar">
      <div className="-translate-y-1/2 absolute flex h-[15.75px] items-center justify-center left-[129.75px] top-1/2 w-[106.88px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "38" } as React.CSSProperties}>
        <div className="flex-none scale-x-105 scale-y-105">
          <Container49 />
        </div>
      </div>
      <Container52 />
      <Container55 />
      <Container58 />
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[14px] relative shrink-0 w-[10.4px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.4 14">
        <g id="Container">
          <path d={svgPaths.p19681a80} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container61 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[14px] relative shrink-0 w-[13px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14">
        <g id="Container">
          <path d={svgPaths.paccb900} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container62 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[16px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 16">
        <g id="Container">
          <path d={svgPaths.p28ce3f00} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container63 />
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="relative shrink-0" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pr-[17px] relative">
        <Button4 />
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="h-[10px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 10">
        <g id="Container">
          <path d={svgPaths.pc80eb80} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container64 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p27589980} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container65 />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p376bf940} fill="var(--fill-0, #44474C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center p-[8px] relative">
        <Container66 />
      </div>
    </div>
  );
}

function VerticalBorder2() {
  return (
    <div className="relative shrink-0" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pr-[17px] relative">
        <Button7 />
        <Button8 />
        <Button9 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Container">
          <path d={svgPaths.p1494980} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#214059] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[20px] py-[8px] relative">
        <Container67 />
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[49.94px]">
          <p className="leading-[20px]">Publish</p>
        </div>
      </div>
    </div>
  );
}

function FloatingEditorToolbar() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(255,255,255,0.7)] bottom-[48px] content-stretch flex gap-[24px] items-center left-[29.69%] px-[25px] py-[13px] right-[29.69%] rounded-[9999px]" data-name="Floating Editor Toolbar">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_12px_40px_0px_rgba(25,28,29,0.1)]" />
      <VerticalBorder1 />
      <VerticalBorder2 />
      <Button10 />
    </div>
  );
}

export default function EditorTheArchitect() {
  return (
    <div className="bg-[#f8f9fa] content-stretch flex flex-col items-start relative size-full" data-name="Editor - The Architect">
      <Container />
      <TopNavigationBar />
      <FooterContextualStatusBar />
      <FloatingEditorToolbar />
    </div>
  );
}