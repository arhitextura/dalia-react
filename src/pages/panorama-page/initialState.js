/**
 * Accessing userPage, a Project is Loaded -> Set the State to the initial marked scene object ->
 * When user clicks on hotspot set the state to a scene ID to which is linked
 *
 *
 */

const initialState = {
  
    "ID01": {
      name: "CASA SOL",
      scenes: {
        scene01: {
          title: "Scene title",
          image360: "Link to the image",
          hotspots: {
            "ID01": { x: -300, y: 0, z: 490, linkTo: "scene04", title: "Title" },
            "ID02": { x: -300, y: 0, z: 490, linkTo: "scene03", title: "Title" }
          },
        },
        scenes02: {
          title: "Scene title",
          image360: "Link to the image",
          hotspots: {
            "ID01": { x: -300, y: 0, z: 490, linkTo: "scene01", title: "Title" },
            "ID02": { x: -300, y: 0, z: 490, linkTo: "scene03", title: "Title" }
          },
        },
      },
    }
};

/**
 * Methods:
 * addProject(ID, name)
 * addSceneToProject(projectID, sceneID, title, image, thumbnail, hotspots)
 * addHotspotToScene(sceneId,hotspotID, x, y, z, imageLink, Title)
 * removeHotspot(hotSpotID,)
 */

export default initialState;
