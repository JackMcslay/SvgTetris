<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 	
	xmlns:svg="http://www.w3.org/2000/svg"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink" 
	version="1.0"
>
	<xsl:output method="xml"/>
	<xsl:template match="/lang">
		<xsl:processing-instruction name="xml-stylesheet">href="Game.css" type="text/css"</xsl:processing-instruction> 
		<svg
			version="1.1"
			viewBox="0 0 2000 2000">
			<defs>
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="RedRect"
					transform="scale(0.015625)"
				/>
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="GreenRect"
					transform="scale(0.015625)" />
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="BlueRect"
					transform="scale(0.015625)" />
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="YellowRect"
					transform="scale(0.015625)" />
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="CyanRect"
					transform="scale(0.015625)"/>
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="MagentaRect"
					transform="scale(0.015625)"/>
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="GrayRect"
					transform="scale(0.015625)"/>
				<rect 
					width="64"
					height="64"
					rx="8"
					ry="8"
					x="-32"
					y="-32"
					id="TargetRect"
					transform="scale(0.015625)"/>
			</defs>
			
			<image id="BackGround" x="0" y="0" transform="scale(1)" width="1074" height="895" xlink:href="http://upload.wikimedia.org/wikipedia/commons/1/1f/52706main_hstorion_lg.jpg"/>
			<g id="GameScreen">
				<rect id="PlayAreaBorder" class="Area" x="0.5" y="0.5" rx="0.25" ry="0.25" />
				<path d="M 1,5 13,5" class="Line" />
				<g id="PlayArea" transform="translate(1.5,1.5)"/>
				<g id="TargetArea" transform="translate(1.5,1.5)"/>
				<g transform="translate(-0.5,0.5)">
					<g id="QueueResize">
						<rect id="QueueBorder" class="Area" x="-5" y="0" width="5" rx="0.25" ry="0.25" />
						<g id="Queue" transform="translate(-2.5,2.5)"/>
					</g>
					<text transform="translate(-10,1) scale(0.1) " >
						<xsl:value-of select="@Pieces"/>
					</text>
					<text id="PieceCount" transform="translate(-4,2) scale(0.1) " style="text-anchor: end" />
					<text transform="translate(-10,3) scale(0.1) " >
						<xsl:value-of select="@Lines"/>
					</text>
					<text id="LineCount" transform="translate(-4,4) scale(0.1) "  style="text-anchor: end"/>
					<text transform="translate(-10,5) scale(0.1) " >
						<xsl:value-of select="@Time"/>
					</text>
					<text id="TimeCounter" transform="translate(-4,6) scale(0.1) " style="text-anchor: end" />
					<text transform="translate(-10,7) scale(0.1) " >
						<xsl:value-of select="@Score"/>
					</text>
					<text id="ScoreBoard" transform="translate(-4,8) scale(0.1) " style="text-anchor: end" />
					<text transform="translate(-10,9) scale(0.1) " >
						<xsl:value-of select="@Speed"/>
					</text>
					<text id="Speedometer" transform="translate(-4,10) scale(0.1) " style="text-anchor: end" />
				</g>
			</g>
			<g id="PauseScreen" style="opacity:0" transform="translate(6,5)" onclick="UnPause()">
				<rect id="PlayAreaBorder" class="Area" x="-100" y="-100"  width="200" height="200"/>
				<text transform="scale(0.1) " >
					<xsl:value-of select="@Paused"/>
				</text>
				<text transform="translate(0,3) scale(0.1) "  style="cursor: hand; text-anchor: middle;">
					<tspan><xsl:value-of select="@Continue"/></tspan>
				</text>
			</g>
	
			<script type="text/javascript" xlink:href="Common.js" />
			<script type="text/javascript" xlink:href="PlayArea.class.js" />
			<script type="text/javascript" xlink:href="PieceQueue.class.js" />
			<script type="text/javascript" xlink:href="Piece.class.js" />
			<script type="text/javascript" xlink:href="Main.js" />
			<script type="text/javascript" xlink:href="progss.js" />
	
	
		</svg>
	</xsl:template>

</xsl:stylesheet>
